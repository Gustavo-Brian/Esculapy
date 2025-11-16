package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FarmaciaInfoRequest {

    @NotBlank
    private String nomeFantasia;

    @NotBlank @Email
    private String emailContato;

    @NotBlank
    private String numeroCelularContato;
}