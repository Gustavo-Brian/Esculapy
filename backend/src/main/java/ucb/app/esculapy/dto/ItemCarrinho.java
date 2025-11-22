package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO que representa um item dentro de um carrinho de compras ou de uma lista de itens de pedido.
 */
@Data
public class ItemCarrinho {

    @NotNull
    private Long estoqueLojistaId;

    @NotNull
    @Min(1)
    private Integer quantidade;
}