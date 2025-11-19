package ucb.app.esculapy.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

/**
 * DTO que representa o conteúdo de um carrinho de compras, contendo uma lista de itens.
 */
@Data
public class CarrinhoRequest {

    @Valid
    @NotEmpty
    private List<ItemCarrinho> itens;
}