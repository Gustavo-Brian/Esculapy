package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ItemCarrinho {

    @NotNull
    private Long estoqueLojistaId; // O ID do item de estoque

    @NotNull
    @Min(1)
    private Integer quantidade;
}