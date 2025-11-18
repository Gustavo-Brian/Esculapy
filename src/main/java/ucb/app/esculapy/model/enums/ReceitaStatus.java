package ucb.app.esculapy.model.enums;

/**
 * Define os estados da validação de uma Receita.
 */
public enum ReceitaStatus {
    /**
     * O arquivo foi enviado pelo cliente e aguarda análise.
     */
    PENDENTE_VALIDACAO,

    /**
     * O farmacêutico validou e aprovou a receita.
     */
    APROVADA,

    /**
     * O farmacêutico analisou e rejeitou a receita.
     */
    REJEITADA
}