package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ProfileUpdateRequest {

    @NotBlank
    private String nome;

    @NotBlank
    private String numeroCelular;

    // Email e CPF não podem ser alterados pelo perfil
}