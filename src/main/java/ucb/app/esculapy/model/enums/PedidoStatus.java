package ucb.app.esculapy.model.enums;

/**
 * Define os estados possíveis de um Pedido.
 */
public enum PedidoStatus {
    /**
     * O pedido foi criado, mas aguarda o upload e validação da receita.
     */
    AGUARDANDO_VALIDACAO_FARMACEUTICA,

    /**
     * A receita foi aprovada (ou não era necessária). Aguardando pagamento.
     */
    AGUARDANDO_PAGAMENTO,

    /**
     * Pagamento confirmado, aguardando separação.
     */
    PAGAMENTO_APROVADO,

    /**
     * Pagamento aprovado, pedido está sendo separado no estoque.
     * (Este era o status que faltava)
     */
    EM_SEPARACAO,

    /**
     * Pedido em rota de entrega.
     */
    EM_TRANSPORTE,

    /**
     * Pedido entregue ao cliente.
     */
    ENTREGUE,

    /**
     * O pedido foi cancelado (ex: receita rejeitada, falta de pagamento).
     */
    CANCELADO
}