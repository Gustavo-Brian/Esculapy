package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FarmaceuticoUpdateRequest {

    @NotBlank
    private String nome;

    @NotBlank
    private String numeroCelular;

    // Nota: Email, CPF e CRF não podem ser alterados para
    // manter a integridade dos dados.
    // A senha é alterada em outro fluxo (ex: "resetar senha").
}