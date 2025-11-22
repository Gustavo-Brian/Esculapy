package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para solicitar a atualização das informações de contato de uma farmácia
 * pelo seu administrador (lojista).
 */
@Data
public class FarmaciaInfoRequest {

    @NotBlank
    private String nomeFantasia;

    @NotBlank @Email
    private String emailContato;

    @NotBlank
    private String numeroCelularContato;
}