package ucb.app.esculapy.model.enums;

/**
 * Define o status de uma Farmácia (Lojista) na plataforma.
 */
public enum LojistaStatus {
    /**
     * A farmácia se cadastrou, mas aguarda aprovação do Admin da plataforma.
     * (Usado em AuthService)
     */
    PENDENTE_APROVACAO,

    /**
     * Farmácia aprovada e pode operar.
     */
    ATIVO,

    /**
     * Farmácia suspensa ou bloqueada.
     */
    SUSPENSO
}