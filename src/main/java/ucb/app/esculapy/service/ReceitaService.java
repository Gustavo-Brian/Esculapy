package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.*; // <-- IMPORTAR TUDO
import ucb.app.esculapy.model.enums.PedidoStatus;
import ucb.app.esculapy.model.enums.ReceitaStatus;
import ucb.app.esculapy.repository.EstoqueLojistaRepository; // <-- 1. IMPORTAR
import ucb.app.esculapy.repository.PedidoRepository;
import ucb.app.esculapy.repository.ReceitaRepository;

import java.time.LocalDateTime;
import java.util.List;
// Os imports 'Objects' e 'Collectors' não são mais necessários aqui

@Service
@RequiredArgsConstructor
public class ReceitaService {

    private final PedidoRepository pedidoRepository;
    private final ReceitaRepository receitaRepository;
    private final AuthenticationService authenticationService;
    private final EstoqueLojistaRepository estoqueLojistaRepository; // <-- 2. INJETAR REPO

    /**
     * Busca pedidos pendentes de validação para a farmácia do farmacêutico logado.
     * (VERSÃO OTIMIZADA)
     */
    @Transactional(readOnly = true) // Boa prática para métodos de busca
    public List<Pedido> buscarPendentes() {
        // 1. Pega o farmacêutico logado e o ID da sua farmácia
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Long farmaciaId = farmaceutico.getFarmacia().getId();

        // 2. Usa a query otimizada do repositório
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

        // Atualiza a receita
        receita.setStatus(ReceitaStatus.APROVADA);
        receita.setFarmaceuticoValidador(farmaceutico);
        receita.setDataValidacao(LocalDateTime.now());
        receita.setJustificativaRejeicao(null);
        receitaRepository.save(receita);

        // Atualiza o pedido: liberado para pagamento
        pedido.setStatus(PedidoStatus.AGUARDANDO_PAGAMENTO);
        return pedidoRepository.save(pedido);
    }

    /**
     * Rejeita a receita de um pedido específico.
     * (VERSÃO COM ESTORNO DE ESTOQUE)
     */
    @Transactional
    public Pedido rejeitarReceita(Long pedidoId, String justificativa) {
        Farmaceutico farmaceutico = authenticationService.getFarmaceuticoLogado();
        Pedido pedido = getPedidoValidado(pedidoId, farmaceutico); // Busca e valida

        Receita receita = pedido.getReceita();
        if (receita == null) {
            throw new ResourceNotFoundException("Pedido " + pedidoId + " não possui uma receita anexada.");
        }

        // --- 3. INÍCIO DA LÓGICA DE ESTORNO ---
        // Itera sobre os itens do pedido (que já foram carregados pelo JOIN FETCH)
        for (ItemPedido item : pedido.getItens()) {
            EstoqueLojista estoque = item.getEstoqueLojista();
            // Devolve a quantidade comprada de volta ao estoque
            estoque.setQuantidade(estoque.getQuantidade() + item.getQuantidade());
            estoqueLojistaRepository.save(estoque);
        }
        // --- FIM DA LÓGICA DE ESTORNO ---

        // Atualiza a receita
        receita.setStatus(ReceitaStatus.REJEITADA);
        receita.setFarmaceuticoValidador(farmaceutico);
        receita.setDataValidacao(LocalDateTime.now());
        receita.setJustificativaRejeicao(justificativa);
        receitaRepository.save(receita);

        // Atualiza o pedido: cancelado
        pedido.setStatus(PedidoStatus.CANCELADO);
        return pedidoRepository.save(pedido);
    }

    // --- MÉTODOS AUXILIARES PRIVADOS ---

    /**
     * O método pedidoPertenceAFarmacia() foi REMOVIDO
     * A lógica dele foi movida para a query no PedidoRepository.
     */

    /**
     * Busca um pedido e valida se o farmacêutico logado pode gerenciá-lo.
     * (VERSÃO OTIMIZADA)
     */
    private Pedido getPedidoValidado(Long pedidoId, Farmaceutico farmaceutico) {
        Long farmaciaId = farmaceutico.getFarmacia().getId();

        // 1. Usa a query otimizada que busca e valida tudo no banco
        Pedido pedido = pedidoRepository.findPedidoParaValidacao(
                pedidoId,
                PedidoStatus.AGUARDANDO_VALIDACAO_FARMACEUTICA,
                farmaciaId
        ).orElseThrow(() -> new ResourceNotFoundException(
                "Pedido " + pedidoId + " não encontrado, não está aguardando validação, ou não pertence à sua farmácia."
        ));

        // 2. Retorna o pedido (que já vem com itens e estoque carregados)
        return pedido;
    }
}