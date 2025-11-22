package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para solicitar a atualização dos dados do perfil do usuário logado (nome e celular).
 */
@Data
public class ProfileUpdateRequest {

    @NotBlank
    private String nome;

    @NotBlank
    private String numeroCelular;

}