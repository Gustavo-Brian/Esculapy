package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.br.CNPJ;

@Data
public class RegisterFarmaciaRequest {
    @NotBlank @Email
    private String email; // Email do Dono (Admin)

    @NotBlank @Size(min = 6)
    private String senha;

    @NotBlank
    private String cnpj;

    @NotBlank
    private String razaoSocial;

    @NotBlank
    private String nomeFantasia;

    @NotBlank
    private String crfJ; // CRF da Farmácia

    @NotBlank @Email
    private String emailContato;

    @NotBlank
    private String numeroCelularContato;
}