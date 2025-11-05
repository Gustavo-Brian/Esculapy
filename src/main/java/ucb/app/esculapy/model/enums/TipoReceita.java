package ucb.app.esculapy.model.enums;

// Tipo de receita (controla o fluxo de validação)
public enum TipoReceita {
    NAO_EXIGIDO,
    RECEITA_SIMPLES_1_VIA,      // Apresentação (ex: anticoncepcional)
    RECEITA_SIMPLES_2_VIAS,     // Retenção (ex: antibiótico)
    RECEITA_CONTROLE_ESPECIAL,  // Numeração especial (ex: Ritalina)
    RECEITUARIO_AZUL,           // Ex: Morfina
    RECEITUARIO_AMARELO         // Ex: Talidomida
}
