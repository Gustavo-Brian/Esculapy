package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para fornecer uma justificativa ao rejeitar uma receita por um farmacêutico.
 */
@Data
public class ValidacaoReceitaRequest {
    @NotBlank
    private String justificativa;
}