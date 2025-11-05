package ucb.app.esculapy.model.enums;

// Tipo de produto (controla a venda)
public enum TipoProduto {
    MEDICAMENTO_CONTROLADO, // Ex: Tarja Preta
    MEDICAMENTO_ANTIBIOTICO, // Ex: Tarja Vermelha (receita retida)
    MEDICAMENTO_COMUM,      // Ex: Tarja Vermelha/Amarela (só apresentação)
    PERFUMARIA,
    CORRELATO // Ex: Seringa, termômetro
}
