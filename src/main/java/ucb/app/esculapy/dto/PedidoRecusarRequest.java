package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PedidoRecusarRequest {
    @NotBlank
    private String justificativa;
}