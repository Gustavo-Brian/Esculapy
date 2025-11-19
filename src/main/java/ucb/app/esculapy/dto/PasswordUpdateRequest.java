package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * DTO para solicitar a alteração da senha do usuário logado.
 */
@Data
public class PasswordUpdateRequest {

    @NotBlank
    private String senhaAtual;

    @NotBlank
    @Size(min = 6, message = "A nova senha deve ter no mínimo 6 caracteres")
    private String novaSenha;
}