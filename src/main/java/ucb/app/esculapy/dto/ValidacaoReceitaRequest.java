package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ValidacaoReceitaRequest {
    @NotBlank
    private String justificativa;
}