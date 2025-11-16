package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
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
 * Serviço unificado para gerenciar todo o ciclo de vida de um Pedido.
 * Inclui lógica de Cliente, Farmacêutico e Lojista.
 * Substitui PedidoService(antigo), ReceitaService e PedidoManagementService.
 */
@Service
@RequiredArgsConstructor
public class PedidoService {

    // --- Dependências de todos os serviços fundidos ---
    private final PedidoRepository pedidoRepository;
    private final EstoqueLojistaRepository estoqueLojistaRepository;
    private final ReceitaRepository receitaRepository;
    private final EnderecoRepository enderecoRepository;
    private final AuthenticationService authenticationService;
    private final StorageService storageService;


    // ========================================================================
    // --- Lógica de CLIENTE (do antigo PedidoService) ---
    // ========================================================================

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
                throw new ConflictException("Estoque insuficiente para o produto " + estoque.getProduto().getNome());
            }
            if (estoque.getProduto().getTipoReceita() != TipoReceita.NAO_EXIGIDO) {
                receitaExigida = true;
            }

            // Decrementa o estoque
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
            pedido.setStatus(PedidoStatus.AGUARDANDO_VALIDACAO_FARMACEUTICA);
        } else {
            pedido.setStatus(PedidoStatus.AGUARDANDO_PAGAMENTO);
        }

        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido anexarReceita(Long pedidoId, MultipartFile arquivo) {
        Cliente cliente = authenticationService.getClienteLogado();
        Pedido pedido = getPedidoValidadoCliente(pedidoId, cliente);

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_VALIDACAO_FARMACEUTICA) {
            throw new ConflictException("Este pedido não está aguardando validação de receita.");
        }

        String urlArquivo = storageService.upload(arquivo);

        Receita receita = new Receita();
        receita.setPedido(pedido);
        receita.setArquivoUrl(urlArquivo);
        receita.setStatus(ReceitaStatus.PENDENTE_VALIDACAO);
        receita.setDataUpload(LocalDateTime.now());
        receitaRepository.save(receita);

        pedido.setReceita(receita);
        return pedido;
    }

    @Transactional(readOnly = true)
    public List<Pedido> getMeusPedidos() {
        Cliente cliente = authenticationService.getClienteLogado();
        return pedidoRepository.findByClienteId(cliente.getId());
    }

    // ========================================================================
    // --- Lógica de FARMACÊUTICO (do antigo ReceitaService) ---
    // ========================================================================

    @Transactional(readOnly = true)
    public List<Pedido> getPedidosPendentesFarmaceutico() {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Long farmaciaId = farmaceutico.getFarmacia().getId();

        return pedidoRepository.findPedidosPorStatusEFarmacia(
                PedidoStatus.AGUARDANDO_VALIDACAO_FARMACEUTICA,
                farmaciaId
        );
    }

    @Transactional
    public Pedido aprovarReceita(Long pedidoId) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Pedido pedido = getPedidoValidadoFarmaceutico(pedidoId, farmaceutico);

        Receita receita = pedido.getReceita();
        if (receita == null) {
            throw new ResourceNotFoundException("Pedido " + pedidoId + " não possui uma receita anexada.");
        }

        receita.setStatus(ReceitaStatus.APROVADA);
        receita.setFarmaceuticoValidador(farmaceutico);
        receita.setDataValidacao(LocalDateTime.now());
        receita.setJustificativaRejeicao(null);
        receitaRepository.save(receita);

        pedido.setStatus(PedidoStatus.AGUARDANDO_PAGAMENTO);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido rejeitarReceita(Long pedidoId, String justificativa) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Pedido pedido = getPedidoValidadoFarmaceutico(pedidoId, farmaceutico);

        Receita receita = pedido.getReceita();
        if (receita == null) {
            throw new ResourceNotFoundException("Pedido " + pedidoId + " não possui uma receita anexada.");
        }

        // --- Lógica de Estorno de Estoque ---
        for (ItemPedido item : pedido.getItens()) {
            EstoqueLojista estoque = item.getEstoqueLojista();
            estoque.setQuantidade(estoque.getQuantidade() + item.getQuantidade());
            estoqueLojistaRepository.save(estoque);
        }

        receita.setStatus(ReceitaStatus.REJEITADA);
        receita.setFarmaceuticoValidador(farmaceutico);
        receita.setDataValidacao(LocalDateTime.now());
        receita.setJustificativaRejeicao(justificativa);
        receitaRepository.save(receita);

        pedido.setStatus(PedidoStatus.CANCELADO);
        return pedidoRepository.save(pedido);
    }

    // ========================================================================
    // --- Lógica de LOJISTA_ADMIN (do antigo PedidoManagementService) ---
    // ========================================================================

    @Transactional(readOnly = true)
    public List<Pedido> getPedidosDaFarmaciaLogada() {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Long farmaciaId = farmacia.getId();

        // Usa a query otimizada do repositório
        return pedidoRepository.findAllByFarmaciaId(farmaciaId);
    }

    @Transactional
    public Pedido updateStatusPedidoLojista(Long pedidoId, PedidoStatusUpdateRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Long farmaciaId = farmacia.getId();

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido com ID " + pedidoId + " não encontrado."));

        // Validação de posse
        boolean isFarmaciaOwner = pedido.getItens().stream()
                .anyMatch(i -> Objects.equals(i.getEstoqueLojista().getFarmacia().getId(), farmaciaId));

        if (!isFarmaciaOwner) {
            throw new ForbiddenException("Você não tem permissão para gerenciar este pedido.");
        }

        // Validação de Transição de Status
        PedidoStatus novoStatus = request.getStatus();
        if (pedido.getStatus() == PedidoStatus.CANCELADO) {
            throw new ForbiddenException("Pedido cancelado não pode ter o status alterado.");
        }

        // Ex: Lojista só pode mover para "EM_SEPARACAO" se o pagamento
        // foi aprovado (lógica vinda do PagamentoService)
        if (novoStatus == PedidoStatus.EM_SEPARACAO && pedido.getStatus() != PedidoStatus.PAGAMENTO_APROVADO) {
            throw new ConflictException("Não é possível iniciar a separação sem pagamento aprovado.");
        }
        // (Adicionar outras regras de transição aqui)

        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }


    // ========================================================================
    // --- Métodos Auxiliares Privados ---
    // ========================================================================

    /**
     * Busca um pedido e valida se o cliente logado pode gerenciá-lo.
     */
    private Pedido getPedidoValidadoCliente(Long pedidoId, Cliente cliente) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido " + pedidoId + " não encontrado."));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new ForbiddenException("Você não tem permissão para modificar este pedido.");
        }
        return pedido;
    }

    /**
     * Busca um pedido e valida se o farmacêutico logado pode gerenciá-lo.
     */
    private Pedido getPedidoValidadoFarmaceutico(Long pedidoId, Farmaceutico farmaceutico) {
        Long farmaciaId = farmaceutico.getFarmacia().getId();

        // Esta query otimizada já valida posse, status e carrega os dados
        return pedidoRepository.findPedidoParaValidacao(
                pedidoId,
                PedidoStatus.AGUARDANDO_VALIDACAO_FARMACEUTICA,
                farmaciaId
        ).orElseThrow(() -> new ResourceNotFoundException(
                "Pedido " + pedidoId + " não encontrado, não está aguardando validação, ou não pertence à sua farmácia."
        ));
    }
}