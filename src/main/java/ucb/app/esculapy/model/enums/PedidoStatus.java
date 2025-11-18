package ucb.app.esculapy.model.enums;

/**
 * Define os estados possíveis de um Pedido.
 */
public enum PedidoStatus {
    /**
     * O pedido foi criado, mas aguarda o upload e validação da receita.
     */
    AGUARDANDO_RECEITA,

    /**
     * O pedido aguarda pagamento (sem receita ou receita já aprovada).
     */
    AGUARDANDO_PAGAMENTO,

    /**
     * Pagamento confirmado, aguardando aceite da farmácia.
     */
    AGUARDANDO_CONFIRMACAO,

    /**
     * Farmácia aceitou o pedido.
     */
    CONFIRMADO,

    /**
     * Farmácia está separando os itens.
     */
    EM_PREPARACAO,

    /**
     * Pedido pronto para retirada ou entrega.
     */
    PRONTO_PARA_ENTREGA,

    /**
     * Pedido em rota de entrega.
     */
    EM_TRANSPORTE,

    /**
     * Pedido entregue ao cliente.
     */
    ENTREGUE,

    /**
     * O pedido foi cancelado (ex: receita rejeitada, falta de pagamento, cliente desistiu).
     */
    CANCELADO,

    /**
     * O pedido foi recusado pela farmácia (ex: falta de estoque).
     */
    RECUSADO
}