package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para solicitar o início do processo de recuperação de senha, fornecendo o e-mail.
 */
@Data
public class PasswordForgotRequest {
    @NotBlank
    @Email
    private String email;
}