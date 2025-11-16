package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

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
    private String tipoConta; // "CORRENTE" ou "POUPANCA"

    @NotBlank
    private String documentoTitular; // CNPJ da farmácia

    @NotBlank
    private String nomeTitular; // Razão Social
}