package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.br.CPF;

import java.time.LocalDate;

/**
 * DTO para solicitar o registro de um novo usuário do tipo cliente.
 */
@Data
public class RegisterClienteRequest {
    @NotBlank @Size(min = 3)
    private String nome;

    @NotBlank @Email
    private String email;

    @NotBlank @Size(min = 6)
    private String senha;

    @NotBlank
    private String cpf;

    private String numeroCelular;
    private LocalDate dataNascimento;
}