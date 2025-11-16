package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EnderecoRequest {

    @NotBlank
    private String cep;

    @NotBlank
    private String logradouro;

    @NotBlank
    private String numero;

    private String complemento;

    @NotBlank
    private String bairro;

    @NotBlank
    private String cidade;

    @NotBlank
    private String estado;

    /**
     * Tipo do endereço, ex: "CASA", "TRABALHO"
     */
    @NotBlank
    private String tipo;
}