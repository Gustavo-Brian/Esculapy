package ucb.app.esculapy.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.List;

/**
 * DTO para solicitar a criação de um novo pedido.
 */
@Data
public class CriarPedidoRequest {

    @Valid
    @NotEmpty
    private List<ItemCarrinho> itens;

    @NotNull(message = "O ID do endereço de entrega é obrigatório.")
    private Long enderecoId;
}