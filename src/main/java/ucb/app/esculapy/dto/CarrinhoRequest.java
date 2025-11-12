package ucb.app.esculapy.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class CarrinhoRequest {

    @Valid // Garante que os itens dentro da lista sejam validados
    @NotEmpty // Garante que a lista não esteja vazia
    private List<ItemCarrinho> itens;
}