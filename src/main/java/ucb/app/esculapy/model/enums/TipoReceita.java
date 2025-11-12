package ucb.app.esculapy.model.enums;

/**
 * Define o nível de controle (exigência de receita) de um Produto.
 */
public enum TipoReceita {
    /**
     * Não precisa de receita (ex: Dipirona).
     * (Usado em PedidoService)
     */
    NAO_EXIGIDO,

    /**
     * Receita Branca Comum (ex: Antibióticos).
     */
    BRANCA_SIMPLES,

    /**
     * Receita Branca de Controle Especial (ex: Antidepressivos).
     */
    BRANCA_CONTROLE_ESPECIAL,

    /**
     * Receita Azul (ex: Ritalina).
     */
    AZUL_B,

    /**
     * Receita Amarela (ex: Morfina).
     */
    AMARELA_A
}