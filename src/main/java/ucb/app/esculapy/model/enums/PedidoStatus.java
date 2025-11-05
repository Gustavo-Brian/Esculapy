package ucb.app.esculapy.model.enums;

public enum PedidoStatus {
    CARRINHO,
    AGUARDANDO_PAGAMENTO,
    AGUARDANDO_VALIDACAO_FARMACEUTICA, // Etapa crucial
    PAGAMENTO_APROVADO,
    PAGAMENTO_REJEITADO,
    EM_SEPARACAO,
    ENVIADO,
    ENTREGUE,
    CANCELADO
}