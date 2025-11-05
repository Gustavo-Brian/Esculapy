package ucb.app.esculapy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class EstoqueRequest {

    /**
     * O ID do Produto (do catálogo central) que a farmácia quer começar a vender.
     */
    @NotNull(message = "O ID do produto não pode ser nulo.")
    private Long produtoId;

    /**
     * O preço de venda que esta farmácia específica cobrará.
     */
    @NotNull(message = "O preço não pode ser nulo.")
    @Positive(message = "O preço deve ser maior que zero.")
    private BigDecimal preco;

    /**
     * A quantidade inicial em estoque.
     */
    @NotNull(message = "A quantidade não pode ser nula.")
    @Min(value = 0, message = "A quantidade não pode ser negativa.")
    private Integer quantidade;
}