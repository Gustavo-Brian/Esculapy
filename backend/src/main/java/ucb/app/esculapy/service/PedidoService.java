package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.dto.CriarPedidoRequest;
import ucb.app.esculapy.dto.ItemCarrinho;
import ucb.app.esculapy.dto.PedidoStatusUpdateRequest;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.*;
import ucb.app.esculapy.model.enums.PedidoStatus;
import ucb.app.esculapy.model.enums.ReceitaStatus;
import ucb.app.esculapy.model.enums.TipoReceita;
import ucb.app.esculapy.repository.EnderecoRepository;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.PedidoRepository;
import ucb.app.esculapy.repository.ReceitaRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Serviço responsável por toda a lógica de negócios relacionada a Pedidos,
 * incluindo criação, anexo de receita, cancelamento (Cliente), e gerenciamento (Lojista/Farmacêutico).
 */
@Service
@RequiredArgsConstructor
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final EstoqueLojistaRepository estoqueLojistaRepository;
    private final ReceitaRepository receitaRepository;
    private final EnderecoRepository enderecoRepository;
    private final AuthenticationService authenticationService;
    private final StorageService storageService;

    // ========================================================================
    // --- Lógica de CLIENTE ---
    // ========================================================================

    /**
     * Cria um novo pedido, verifica estoque, calcula o valor total, baixa o estoque
     * e define o status inicial (AGUARDANDO_RECEITA ou AGUARDANDO_PAGAMENTO).
     *
     * @param request O DTO {@link CriarPedidoRequest}.
     * @return O objeto {@link Pedido} criado.
     * @throws ResourceNotFoundException Se o endereço ou item de estoque não for encontrado.
     * @throws ConflictException Se houver estoque insuficiente.
     */
    @Transactional
    public Pedido criarPedido(CriarPedidoRequest request) {
        Cliente cliente = authenticationService.getClienteLogado();
        Endereco endereco = enderecoRepository.findByIdAndClienteId(request.getEnderecoId(), cliente.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço com ID " + request.getEnderecoId() + " não encontrado ou não pertence a você."));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataPedido(LocalDateTime.now());
        pedido.setEnderecoEntrega(endereco);

        BigDecimal valorTotal = BigDecimal.ZERO;
        List<ItemPedido> itensPedido = new ArrayList<>();
        boolean receitaExigida = false;

        for (ItemCarrinho itemDTO : request.getItens()) {
            EstoqueLojista estoque = estoqueLojistaRepository.findById(itemDTO.getEstoqueLojistaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Item de estoque " + itemDTO.getEstoqueLojistaId() + " não encontrado."));

            if (estoque.getQuantidade() < itemDTO.getQuantidade()) {
                // Reverte o estoque de todos os itens já processados em caso de falha.
                throw new ConflictException("Estoque insuficiente para o produto " + estoque.getProduto().getNome());
            }
            if (estoque.getProduto().getTipoReceita() != TipoReceita.NAO_EXIGIDO) {
                receitaExigida = true;
            }

            // Baixa no estoque
            estoque.setQuantidade(estoque.getQuantidade() - itemDTO.getQuantidade());
            estoqueLojistaRepository.save(estoque);

            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido);
            itemPedido.setEstoqueLojista(estoque);
            itemPedido.setQuantidade(itemDTO.getQuantidade());
            itemPedido.setPrecoUnitario(estoque.getPreco());
            itensPedido.add(itemPedido);

            valorTotal = valorTotal.add(estoque.getPreco().multiply(new BigDecimal(itemDTO.getQuantidade())));
        }

        pedido.setItens(itensPedido);
        pedido.setValorTotal(valorTotal);

        if (receitaExigida) {
            pedido.setStatus(PedidoStatus.AGUARDANDO_RECEITA);
        } else {
            pedido.setStatus(PedidoStatus.AGUARDANDO_PAGAMENTO);
        }

        return pedidoRepository.save(pedido);
    }

    /**
     * Anexa um arquivo de receita a um pedido que está em AGUARDANDO_RECEITA.
     *
     * @param pedidoId O ID do pedido.
     * @param arquivo O arquivo da receita.
     * @return O objeto {@link Pedido} atualizado para AGUARDANDO_PAGAMENTO.
     * @throws ResourceNotFoundException Se o pedido não for encontrado.
     * @throws ForbiddenException Se o pedido não pertencer ao cliente.
     * @throws ConflictException Se o pedido não estiver no status correto.
     */
    @Transactional
    public Pedido anexarReceita(Long pedidoId, MultipartFile arquivo) {
        Cliente cliente = authenticationService.getClienteLogado();
        Pedido pedido = getPedidoValidadoCliente(pedidoId, cliente.getId());

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_RECEITA) {
            throw new ConflictException("Este pedido não está aguardando anexo de receita.");
        }

        String urlArquivo = storageService.upload(arquivo);

        Receita receita = new Receita();
        receita.setPedido(pedido);
        receita.setArquivoUrl(urlArquivo);
        receita.setStatus(ReceitaStatus.PENDENTE_VALIDACAO);
        receita.setDataUpload(LocalDateTime.now());
        receitaRepository.save(receita);

        pedido.setReceita(receita);
        pedido.setStatus(PedidoStatus.AGUARDANDO_PAGAMENTO);

        return pedidoRepository.save(pedido);
    }

    /**
     * Lista paginada dos pedidos do cliente logado.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de {@link Pedido}.
     */
    @Transactional(readOnly = true)
    public Page<Pedido> getMeusPedidos(Pageable pageable) {
        Cliente cliente = authenticationService.getClienteLogado();
        return pedidoRepository.findByClienteId(cliente.getId(), pageable);
    }

    /**
     * Obtém os detalhes de um pedido específico para o cliente logado.
     *
     * @param pedidoId O ID do pedido.
     * @return O objeto {@link Pedido}.
     * @throws ResourceNotFoundException Se o pedido não for encontrado.
     * @throws ForbiddenException Se o pedido não pertencer ao cliente.
     */
    @Transactional(readOnly = true)
    public Pedido getPedidoDetalhesCliente(Long pedidoId) {
        Cliente cliente = authenticationService.getClienteLogado();
        return getPedidoValidadoCliente(pedidoId, cliente.getId());
    }

    /**
     * Cancela um pedido, se ele estiver em um status elegível para cancelamento.
     *
     * @param pedidoId O ID do pedido.
     * @return O objeto {@link Pedido} atualizado para CANCELADO.
     * @throws ResourceNotFoundException Se o pedido não for encontrado.
     * @throws ForbiddenException Se o pedido não pertencer ao cliente.
     * @throws ConflictException Se o pedido não puder mais ser cancelado.
     */
    @Transactional
    public Pedido cancelarPedido(Long pedidoId) {
        Cliente cliente = authenticationService.getClienteLogado();
        Pedido pedido = getPedidoValidadoCliente(pedidoId, cliente.getId());

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_PAGAMENTO &&
                pedido.getStatus() != PedidoStatus.AGUARDANDO_RECEITA &&
                pedido.getStatus() != PedidoStatus.AGUARDANDO_CONFIRMACAO)
        {
            throw new ConflictException("Este pedido não pode mais ser cancelado pelo cliente. Status: " + pedido.getStatus());
        }

        estornarEstoquePedido(pedido);
        pedido.setStatus(PedidoStatus.CANCELADO);
        return pedidoRepository.save(pedido);
    }


    // ========================================================================
    // --- Lógica de FARMACÊUTICO ---
    // ========================================================================

    /**
     * Lista paginada dos pedidos da farmácia que precisam de atenção do farmacêutico.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de {@link Pedido}.
     */
    @Transactional(readOnly = true)
    public Page<Pedido> getPedidosPendentesFarmaceutico(Pageable pageable) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Long farmaciaId = farmaceutico.getFarmacia().getId();

        return pedidoRepository.findPedidosPorStatusEFarmacia(
                PedidoStatus.AGUARDANDO_PAGAMENTO,
                farmaciaId,
                pageable
        );
    }

    /**
     * Aprova a receita anexada a um pedido.
     *
     * @param pedidoId O ID do pedido.
     * @return O objeto {@link Pedido}.
     * @throws ResourceNotFoundException Se o pedido ou a receita não for encontrada.
     */
    @Transactional
    public Pedido aprovarReceita(Long pedidoId) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Pedido pedido = getPedidoValidadoFarmaceutico(pedidoId, farmaceutico);
        Receita receita = getReceitaDoPedido(pedido);

        receita.setStatus(ReceitaStatus.APROVADA);
        receita.setFarmaceuticoValidador(farmaceutico);
        receita.setDataValidacao(LocalDateTime.now());
        receita.setJustificativaRejeicao(null);
        receitaRepository.save(receita);

        return pedido;
    }

    /**
     * Rejeita a receita anexada a um pedido, cancelando o pedido e estornando o estoque.
     *
     * @param pedidoId O ID do pedido.
     * @param justificativa A justificativa para a rejeição.
     * @return O objeto {@link Pedido} atualizado para CANCELADO.
     * @throws ResourceNotFoundException Se o pedido ou a receita não for encontrada.
     */
    @Transactional
    public Pedido rejeitarReceita(Long pedidoId, String justificativa) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Pedido pedido = getPedidoValidadoFarmaceutico(pedidoId, farmaceutico);
        Receita receita = getReceitaDoPedido(pedido);

        estornarEstoquePedido(pedido);

        receita.setStatus(ReceitaStatus.REJEITADA);
        receita.setFarmaceuticoValidador(farmaceutico);
        receita.setDataValidacao(LocalDateTime.now());
        receita.setJustificativaRejeicao(justificativa);
        receitaRepository.save(receita);

        pedido.setStatus(PedidoStatus.CANCELADO);
        return pedidoRepository.save(pedido);
    }

    /**
     * Obtém os detalhes de um pedido específico para o farmacêutico.
     *
     * @param pedidoId O ID do pedido.
     * @return O objeto {@link Pedido}.
     * @throws ResourceNotFoundException Se o pedido não for encontrado ou não pertencer à farmácia.
     */
    @Transactional(readOnly = true)
    public Pedido getPedidoDetalhesFarmaceutico(Long pedidoId) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        return getPedidoValidadoFarmaceutico(pedidoId, farmaceutico);
    }


    // ========================================================================
    // --- Lógica de LOJISTA_ADMIN ---
    // ========================================================================

    /**
     * Lista paginada de todos os pedidos da farmácia do lojista logado.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de {@link Pedido}.
     */
    @Transactional(readOnly = true)
    public Page<Pedido> getPedidosDaFarmaciaLogada(Pageable pageable) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        return pedidoRepository.findAllByFarmaciaId(farmacia.getId(), pageable);
    }

    /**
     * Atualiza o status de um pedido pelo lojista (a partir de CONFIRMADO).
     *
     * @param pedidoId O ID do pedido.
     * @param request O DTO {@link PedidoStatusUpdateRequest}.
     * @return O objeto {@link Pedido} atualizado.
     * @throws ForbiddenException Se o status for inválido (tentativa de regredir o fluxo) ou se o pedido estiver finalizado.
     */
    @Transactional
    public Pedido updateStatusPedidoLojista(Long pedidoId, PedidoStatusUpdateRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Pedido pedido = getPedidoValidadoLojista(pedidoId, farmacia.getId());
        PedidoStatus novoStatus = request.getStatus();

        if (pedido.getStatus() == PedidoStatus.CANCELADO || pedido.getStatus() == PedidoStatus.RECUSADO || pedido.getStatus() == PedidoStatus.ENTREGUE) {
            throw new ForbiddenException("Pedido finalizado/cancelado/recusado não pode ter o status alterado.");
        }

        if (novoStatus == PedidoStatus.AGUARDANDO_RECEITA ||
                novoStatus == PedidoStatus.AGUARDANDO_PAGAMENTO ||
                novoStatus == PedidoStatus.AGUARDANDO_CONFIRMACAO) {
            throw new ForbiddenException("Transição de status inválida para lojista. Status não pode ser regredido ou pulado para inicial.");
        }

        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }

    /**
     * Obtém os detalhes de um pedido específico para o lojista.
     *
     * @param pedidoId O ID do pedido.
     * @return O objeto {@link Pedido}.
     * @throws ForbiddenException Se o pedido não pertencer à farmácia.
     */
    @Transactional(readOnly = true)
    public Pedido getPedidoDetalhesLojista(Long pedidoId) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        return getPedidoValidadoLojista(pedidoId, farmacia.getId());
    }

    /**
     * Aceita um pedido que está em AGUARDANDO_CONFIRMACAO (após pagamento e aprovação de receita).
     *
     * @param pedidoId O ID do pedido.
     * @return O objeto {@link Pedido} atualizado para CONFIRMADO.
     * @throws ConflictException Se o status não for AGUARDANDO_CONFIRMACAO ou se a receita não tiver sido aprovada.
     */
    @Transactional
    public Pedido aceitarPedido(Long pedidoId) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Pedido pedido = getPedidoValidadoLojista(pedidoId, farmacia.getId());

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_CONFIRMACAO) {
            throw new ConflictException("Apenas pedidos aguardando confirmação podem ser aceitos. Status atual: " + pedido.getStatus());
        }

        if (pedido.getReceita() != null && pedido.getReceita().getStatus() != ReceitaStatus.APROVADA) {
            throw new ConflictException("Não é possível aceitar o pedido pois a receita ainda não foi aprovada.");
        }

        pedido.setStatus(PedidoStatus.CONFIRMADO);
        return pedidoRepository.save(pedido);
    }

    /**
     * Recusa um pedido que está em AGUARDANDO_CONFIRMACAO, estornando o estoque.
     *
     * @param pedidoId O ID do pedido.
     * @param justificativa A justificativa da recusa.
     * @return O objeto {@link Pedido} atualizado para RECUSADO.
     * @throws ConflictException Se o status não for AGUARDANDO_CONFIRMACAO.
     */
    @Transactional
    public Pedido recusarPedido(Long pedidoId, String justificativa) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Pedido pedido = getPedidoValidadoLojista(pedidoId, farmacia.getId());

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_CONFIRMACAO) {
            throw new ConflictException("Apenas pedidos aguardando confirmação podem ser recusados. Status atual: " + pedido.getStatus());
        }

        estornarEstoquePedido(pedido);
        pedido.setStatus(PedidoStatus.RECUSADO);
        return pedidoRepository.save(pedido);
    }


    // ========================================================================
    // --- Métodos Auxiliares Privados ---
    // ========================================================================

    /**
     * Estorna a quantidade de itens do pedido para o estoque da farmácia.
     *
     * @param pedido O objeto {@link Pedido} cujos itens serão estornados.
     */
    private void estornarEstoquePedido(Pedido pedido) {
        for (ItemPedido item : pedido.getItens()) {
            EstoqueLojista estoque = item.getEstoqueLojista();
            estoque.setQuantidade(estoque.getQuantidade() + item.getQuantidade());
            estoqueLojistaRepository.save(estoque);
        }
    }

    /**
     * Obtém o objeto Receita de um Pedido, garantindo que ele exista.
     *
     * @param pedido O objeto {@link Pedido}.
     * @return O objeto {@link Receita}.
     * @throws ResourceNotFoundException Se o pedido não tiver receita anexada.
     */
    private Receita getReceitaDoPedido(Pedido pedido) {
        Receita receita = pedido.getReceita();
        if (receita == null) {
            throw new ResourceNotFoundException("Pedido " + pedido.getId() + " não possui uma receita anexada.");
        }
        return receita;
    }

    /**
     * Busca um pedido e valida se ele pertence ao cliente especificado.
     *
     * @param pedidoId O ID do pedido.
     * @param clienteId O ID do cliente esperado.
     * @return O objeto {@link Pedido}.
     * @throws ResourceNotFoundException Se o pedido não for encontrado.
     * @throws ForbiddenException Se o pedido não pertencer ao cliente.
     */
    private Pedido getPedidoValidadoCliente(Long pedidoId, Long clienteId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido " + pedidoId + " não encontrado."));
        if (!pedido.getCliente().getId().equals(clienteId)) {
            throw new ForbiddenException("Você não tem permissão para modificar este pedido.");
        }
        return pedido;
    }

    /**
     * Busca um pedido e valida se ele pertence à farmácia do farmacêutico especificado.
     *
     * @param pedidoId O ID do pedido.
     * @param farmaceutico O objeto {@link Farmaceutico} logado.
     * @return O objeto {@link Pedido}.
     * @throws ResourceNotFoundException Se o pedido não for encontrado ou não pertencer à farmácia.
     */
    private Pedido getPedidoValidadoFarmaceutico(Long pedidoId, Farmaceutico farmaceutico) {
        Long farmaciaId = farmaceutico.getFarmacia().getId();
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido " + pedidoId + " não encontrado."));

        boolean isFarmaciaOwner = pedido.getItens().stream()
                .anyMatch(i -> Objects.equals(i.getEstoqueLojista().getFarmacia().getId(), farmaciaId));

        if (!isFarmaciaOwner) {
            throw new ResourceNotFoundException("Pedido não encontrado ou não pertence à sua farmácia.");
        }

        return pedido;
    }

    /**
     * Busca um pedido e valida se ele pertence à farmácia do lojista especificado.
     *
     * @param pedidoId O ID do pedido.
     * @param farmaciaId O ID da farmácia esperada.
     * @return O objeto {@link Pedido}.
     * @throws ResourceNotFoundException Se o pedido não for encontrado.
     * @throws ForbiddenException Se o pedido não pertencer à farmácia.
     */
    private Pedido getPedidoValidadoLojista(Long pedidoId, Long farmaciaId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido com ID " + pedidoId + " não encontrado."));

        boolean isFarmaciaOwner = pedido.getItens().stream()
                .anyMatch(i -> Objects.equals(i.getEstoqueLojista().getFarmacia().getId(), farmaciaId));

        if (!isFarmaciaOwner) {
            throw new ForbiddenException("Você não tem permissão para gerenciar este pedido.");
        }
        return pedido;
    }
}