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
        // Agora o fluxo segue para o pagamento (paralelo à validação)
        pedido.setStatus(PedidoStatus.AGUARDANDO_PAGAMENTO);

        return pedidoRepository.save(pedido);
    }

    @Transactional(readOnly = true)
    public Page<Pedido> getMeusPedidos(Pageable pageable) {
        Cliente cliente = authenticationService.getClienteLogado();
        return pedidoRepository.findByClienteId(cliente.getId(), pageable);
    }

    @Transactional(readOnly = true)
    public Pedido getPedidoDetalhesCliente(Long pedidoId) {
        Cliente cliente = authenticationService.getClienteLogado();
        return getPedidoValidadoCliente(pedidoId, cliente.getId());
    }

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

    @Transactional(readOnly = true)
    public Page<Pedido> getPedidosPendentesFarmaceutico(Pageable pageable) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Long farmaciaId = farmaceutico.getFarmacia().getId();

        // Farmacêutico verifica receitas enquanto o pagamento está pendente ou aguardando confirmação
        // Para simplificar, buscamos AGUARDANDO_PAGAMENTO por padrão, mas poderíamos expandir
        return pedidoRepository.findPedidosPorStatusEFarmacia(
                PedidoStatus.AGUARDANDO_PAGAMENTO,
                farmaciaId,
                pageable
        );
    }

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

    @Transactional(readOnly = true)
    public Pedido getPedidoDetalhesFarmaceutico(Long pedidoId) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        return getPedidoValidadoFarmaceutico(pedidoId, farmaceutico);
    }


    // ========================================================================
    // --- Lógica de LOJISTA_ADMIN ---
    // ========================================================================

    @Transactional(readOnly = true)
    public Page<Pedido> getPedidosDaFarmaciaLogada(Pageable pageable) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        return pedidoRepository.findAllByFarmaciaId(farmacia.getId(), pageable);
    }

    @Transactional
    public Pedido updateStatusPedidoLojista(Long pedidoId, PedidoStatusUpdateRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Pedido pedido = getPedidoValidadoLojista(pedidoId, farmacia.getId());
        PedidoStatus novoStatus = request.getStatus();

        if (pedido.getStatus() == PedidoStatus.CANCELADO || pedido.getStatus() == PedidoStatus.RECUSADO) {
            throw new ForbiddenException("Pedido cancelado/recusado não pode ter o status alterado.");
        }

        // Lojista não pode mover para status anteriores ao CONFIRMADO manualmente
        if (novoStatus == PedidoStatus.AGUARDANDO_RECEITA ||
                novoStatus == PedidoStatus.AGUARDANDO_PAGAMENTO ||
                novoStatus == PedidoStatus.AGUARDANDO_CONFIRMACAO) {
            throw new ForbiddenException("Transição de status inválida para lojista.");
        }

        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }

    @Transactional(readOnly = true)
    public Pedido getPedidoDetalhesLojista(Long pedidoId) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        return getPedidoValidadoLojista(pedidoId, farmacia.getId());
    }

    @Transactional
    public Pedido aceitarPedido(Long pedidoId) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Pedido pedido = getPedidoValidadoLojista(pedidoId, farmacia.getId());

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_CONFIRMACAO) {
            throw new ConflictException("Apenas pedidos aguardando confirmação podem ser aceitos. Status atual: " + pedido.getStatus());
        }

        // Se tiver receita, verifica se foi aprovada
        if (pedido.getReceita() != null && pedido.getReceita().getStatus() != ReceitaStatus.APROVADA) {
            throw new ConflictException("Não é possível aceitar o pedido pois a receita ainda não foi aprovada.");
        }

        pedido.setStatus(PedidoStatus.CONFIRMADO);
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido recusarPedido(Long pedidoId, String justificativa) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Pedido pedido = getPedidoValidadoLojista(pedidoId, farmacia.getId());

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_CONFIRMACAO) {
            throw new ConflictException("Apenas pedidos aguardando confirmação podem ser recusados. Status atual: " + pedido.getStatus());
        }

        estornarEstoquePedido(pedido);
        pedido.setStatus(PedidoStatus.RECUSADO);
        // Futuro: Salvar a justificativa de recusa em algum lugar
        return pedidoRepository.save(pedido);
    }


    // ========================================================================
    // --- Métodos Auxiliares Privados ---
    // ========================================================================

    private void estornarEstoquePedido(Pedido pedido) {
        for (ItemPedido item : pedido.getItens()) {
            EstoqueLojista estoque = item.getEstoqueLojista();
            estoque.setQuantidade(estoque.getQuantidade() + item.getQuantidade());
            estoqueLojistaRepository.save(estoque);
        }
    }

    private Receita getReceitaDoPedido(Pedido pedido) {
        Receita receita = pedido.getReceita();
        if (receita == null) {
            throw new ResourceNotFoundException("Pedido " + pedido.getId() + " não possui uma receita anexada.");
        }
        return receita;
    }

    private Pedido getPedidoValidadoCliente(Long pedidoId, Long clienteId) {
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido " + pedidoId + " não encontrado."));
        if (!pedido.getCliente().getId().equals(clienteId)) {
            throw new ForbiddenException("Você não tem permissão para modificar este pedido.");
        }
        return pedido;
    }

    private Pedido getPedidoValidadoFarmaceutico(Long pedidoId, Farmaceutico farmaceutico) {
        Long farmaciaId = farmaceutico.getFarmacia().getId();
        // A query do repositório findPedidoParaValidacao foi feita para um status específico.
        // Como agora o status pode variar (pagamento pendente, receita pendente),
        // vamos buscar pelo ID e validar manualmente.
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido " + pedidoId + " não encontrado."));

        // Valida se o pedido pertence à farmácia do farmacêutico
        boolean isFarmaciaOwner = pedido.getItens().stream()
                .anyMatch(i -> Objects.equals(i.getEstoqueLojista().getFarmacia().getId(), farmaciaId));

        if (!isFarmaciaOwner) {
            throw new ResourceNotFoundException("Pedido não encontrado ou não pertence à sua farmácia.");
        }

        return pedido;
    }

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