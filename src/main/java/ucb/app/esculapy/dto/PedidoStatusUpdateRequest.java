package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import ucb.app.esculapy.model.enums.PedidoStatus;

@Data
public class PedidoStatusUpdateRequest {
        @NotNull(message = "O novo status é obrigatório.")
        private PedidoStatus status;
}