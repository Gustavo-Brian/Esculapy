package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ucb.app.esculapy.model.enums.TipoProduto;
import ucb.app.esculapy.model.enums.TipoReceita;

@Data
public class ProdutoRequest {

    @NotBlank
    private String ean; // Código de barras

    @NotBlank
    private String nome;

    @NotBlank
    private String principioAtivo;

    @NotBlank
    private String laboratorio;

    private String descricao;

    @NotBlank
    private String codigoRegistroMS; // ANVISA

    private String bulaUrl;

    @NotNull
    private TipoProduto tipoProduto;

    @NotNull
    private TipoReceita tipoReceita;
}