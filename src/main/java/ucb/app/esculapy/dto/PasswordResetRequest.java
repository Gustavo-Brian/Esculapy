package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para solicitar a redefinição da senha usando um token de recuperação.
 */
@Data
public class PasswordResetRequest {
    @NotBlank
    private String token;

    @NotBlank
    @Size(min = 6)
    private String novaSenha;
}