package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class EstoqueRequest {

    @NotNull(message = "O ID do produto não pode ser nulo.")
    private Long produtoId;

    @NotNull(message = "O preço não pode ser nulo.")
    @Positive(message = "O preço deve ser maior que zero.")
    private BigDecimal preco;

    @NotNull(message = "A quantidade não pode ser nula.")
    @Min(value = 0, message = "A quantidade não pode ser negativa.")
    private Integer quantidade;
}