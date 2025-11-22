package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para solicitar a atualização das informações básicas de um farmacêutico (funcionário).
 */
@Data
public class FarmaceuticoUpdateRequest {

    @NotBlank
    private String nome;

    @NotBlank
    private String numeroCelular;
}