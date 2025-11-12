package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.*;
import ucb.app.esculapy.model.enums.PedidoStatus;
import ucb.app.esculapy.model.enums.ReceitaStatus;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.PedidoRepository;
import ucb.app.esculapy.repository.ReceitaRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceitaService {

    private final PedidoRepository pedidoRepository;
    private final ReceitaRepository receitaRepository;
    private final AuthenticationService authenticationService;
    private final EstoqueLojistaRepository estoqueLojistaRepository;

    /**
     * Busca pedidos pendentes de validação para a farmácia do farmacêutico logado.
     * (Otimizado)
     */
    @Transactional(readOnly = true)
    public List<Pedido> buscarPendentes() {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Long farmaciaId = farmaceutico.getFarmacia().getId();

        return pedidoRepository.findPedidosPorStatusEFarmacia(
                PedidoStatus.AGUARDANDO_VALIDACAO_FARMACEUTICA,
                farmaciaId
        );
    }

    /**
     * Aprova a receita de um pedido específico.
     */
    @Transactional
    public Pedido aprovarReceita(Long pedidoId) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Pedido pedido = getPedidoValidado(pedidoId, farmaceutico); // Busca e valida

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

    /**
     * Rejeita a receita de um pedido específico.
     * (Com estorno de estoque)
     */
    @Transactional
    public Pedido rejeitarReceita(Long pedidoId, String justificativa) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Pedido pedido = getPedidoValidado(pedidoId, farmaceutico); // Busca e valida

        Receita receita = pedido.getReceita();
        if (receita == null) {
            throw new ResourceNotFoundException("Pedido " + pedidoId + " não possui uma receita anexada.");
        }

        // Lógica de Estorno de Estoque
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

    /**
     * Busca um pedido e valida se o farmacêutico logado pode gerenciá-lo.
     * (Otimizado)
     */
    private Pedido getPedidoValidado(Long pedidoId, Farmaceutico farmaceutico) {
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