package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.br.CNPJ;

/**
 * DTO para solicitar o registro de uma nova farmácia e seu administrador (lojista).
 */
@Data
public class RegisterFarmaciaRequest {
    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String senha;

    @NotBlank
    private String cnpj;

    @NotBlank
    private String razaoSocial;

    @NotBlank
    private String nomeFantasia;

    @NotBlank
    private String crfJ;

    @NotBlank @Email
    private String emailContato;

    @NotBlank
    private String numeroCelularContato;
}