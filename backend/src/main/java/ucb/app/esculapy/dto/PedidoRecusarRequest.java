package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para fornecer uma justificativa ao recusar um pedido por um lojista.
 */
@Data
public class PedidoRecusarRequest {
    @NotBlank
    private String justificativa;
}