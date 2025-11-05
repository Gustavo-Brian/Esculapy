package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.dto.CarrinhoRequest;
import ucb.app.esculapy.dto.ItemCarrinho;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.*;
import ucb.app.esculapy.model.enums.PedidoStatus;
import ucb.app.esculapy.model.enums.ReceitaStatus;
import ucb.app.esculapy.model.enums.TipoReceita;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.PedidoRepository;
import ucb.app.esculapy.repository.ReceitaRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PedidoService {

    private final AuthenticationService authenticationService;
    private final PedidoRepository pedidoRepository;
    private final EstoqueLojistaRepository estoqueLojistaRepository;
    private final ReceitaRepository receitaRepository;
    private final StorageService storageService;

    @Transactional
    public Pedido criarPedido(CarrinhoRequest request) {
        Cliente cliente = authenticationService.getClienteLogado();

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setDataPedido(LocalDateTime.now());

        BigDecimal valorTotal = BigDecimal.ZERO;
        List<ItemPedido> itensPedido = new ArrayList<>();
        boolean receitaExigida = false;

        // 2. Processar itens do carrinho
        for (ItemCarrinho itemDTO : request.getItens()) {
            EstoqueLojista estoque = estoqueLojistaRepository.findById(itemDTO.getEstoqueLojistaId())
                    .orElseThrow(() -> new ResourceNotFoundException("Item de estoque " + itemDTO.getEstoqueLojistaId() + " não encontrado."));

            // Valida o estoque
            if (estoque.getQuantidade() < itemDTO.getQuantidade()) {
                throw new ForbiddenException("Estoque insuficiente para o produto " + estoque.getProduto().getNome());
            }

            // Checagem de Receita (Lógica de Performance)
            if (estoque.getProduto().getTipoReceita() != TipoReceita.NAO_EXIGIDO) {
                receitaExigida = true;
            }

            // Cria o ItemPedido
            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido);
            itemPedido.setEstoqueLojista(estoque);
            itemPedido.setQuantidade(itemDTO.getQuantidade());
            itemPedido.setPrecoUnitario(estoque.getPreco());
            itensPedido.add(itemPedido);

            valorTotal = valorTotal.add(estoque.getPreco().multiply(new BigDecimal(itemDTO.getQuantidade())));

            // 3. Dar baixa no estoque
            estoque.setQuantidade(estoque.getQuantidade() - itemDTO.getQuantidade());
            estoqueLojistaRepository.save(estoque);
        }

        pedido.setItens(itensPedido);
        pedido.setValorTotal(valorTotal);

        // 4. Verificar se o pedido precisa de receita (usando nossa flag local)
        if (receitaExigida) {
            pedido.setStatus(PedidoStatus.AGUARDANDO_VALIDACAO_FARMACEUTICA);
        } else {
            pedido.setStatus(PedidoStatus.AGUARDANDO_PAGAMENTO);
        }

        // 5. Salvar o pedido
        return pedidoRepository.save(pedido);
    }

    @Transactional
    public Pedido anexarReceita(Long pedidoId, MultipartFile arquivo) {
        // 1. Pegar o Cliente logado
        Cliente cliente = authenticationService.getClienteLogado();

        // 2. Buscar e validar o pedido
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido " + pedidoId + " não encontrado."));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new ForbiddenException("Você não tem permissão para modificar este pedido.");
        }
        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_VALIDACAO_FARMACEUTICA) {
            throw new ForbiddenException("Este pedido não está aguardando validação de receita.");
        }

        // 3. Fazer o upload do arquivo
        String urlArquivo = storageService.upload(arquivo);

        // 4. Criar e salvar a entidade Receita
        Receita receita = new Receita();
        receita.setPedido(pedido);
        receita.setArquivoUrl(urlArquivo);
        receita.setStatus(ReceitaStatus.PENDENTE_VALIDACAO);
        receita.setDataUpload(LocalDateTime.now());
        receitaRepository.save(receita);

        // 5. Linkar a receita ao pedido
        pedido.setReceita(receita);

        // 6. [CORREÇÃO] O STATUS PERMANECE AGUARDANDO_VALIDACAO_FARMACEUTICA.
        // A próxima alteração será feita pelo ReceitaService.aprovarReceita.

        return pedido;
    }

    public List<Pedido> getMeusPedidos() {
        Cliente cliente = authenticationService.getClienteLogado();
        return pedidoRepository.findByClienteId(cliente.getId());
    }
}