package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.br.CPF;

@Data
public class RegisterFarmaceuticoRequest {
    @NotBlank
    private String nome;

    @NotBlank @Email
    private String email; // Email de login

    @NotBlank @Size(min = 6)
    private String senha;

    @NotBlank
    private String cpf;

    @NotBlank
    private String crfP; // CRF Pessoal

    @NotBlank
    private String numeroCelular;
}