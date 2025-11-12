package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data; // Usamos @Data para get/set

@Data
public class CheckoutRequest {
        @NotNull(message = "O ID do pedido é obrigatório.")
        private Long pedidoId;

        @NotNull(message = "O ID do endereço de entrega é obrigatório.")
        private Long enderecoId;
}