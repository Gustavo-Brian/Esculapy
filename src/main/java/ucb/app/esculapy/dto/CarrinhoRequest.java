package ucb.app.esculapy.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class CarrinhoRequest {

    @Valid
    @NotEmpty
    private List<ItemCarrinho> itens;

    // Você pode adicionar aqui "enderecoEntregaId", "metodoPagamento", etc.
}