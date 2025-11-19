package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para solicitar a atualização ou criação dos dados de conta bancária de uma farmácia.
 */
@Data
public class ContaBancariaRequest {

    @NotBlank
    private String codigoBanco;

    @NotBlank
    private String agencia;

    @NotBlank
    private String numeroConta;

    @NotBlank
    private String digitoVerificador;

    @NotBlank
    private String tipoConta;

    @NotBlank
    private String documentoTitular;

    @NotBlank
    private String nomeTitular;
}