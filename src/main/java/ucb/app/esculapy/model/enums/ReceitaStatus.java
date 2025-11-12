package ucb.app.esculapy.model.enums;

/**
 * Define os estados da validação de uma Receita.
 */
public enum ReceitaStatus {
    /**
     * O arquivo foi enviado pelo cliente e aguarda análise.
     * (Usado em PedidoService e ReceitaService)
     */
    PENDENTE_VALIDACAO,

    /**
     * O farmacêutico validou e aprovou a receita.
     * (Usado em ReceitaService)
     */
    APROVADA,

    /**
     * O farmacêutico analisou e rejeitou a receita.
     * (Usado em ReceitaService)
     */
    REJEITADA
}