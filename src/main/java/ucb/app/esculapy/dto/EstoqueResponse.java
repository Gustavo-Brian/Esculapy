package ucb.app.esculapy.dto;

import lombok.Getter;
import lombok.Setter;
import ucb.app.esculapy.model.EstoqueLojista;

import java.math.BigDecimal;

@Getter
@Setter
public class EstoqueResponse {

    private Long estoqueId;
    private Long produtoId;
    private String produtoNome;
    private Long farmaciaId;
    private String farmaciaNome;
    private BigDecimal preco;
    private Integer quantidade;

    /**
     * Construtor que mapeia a entidade EstoqueLojista para este DTO.
     */
    public EstoqueResponse(EstoqueLojista estoque) {
        this.estoqueId = estoque.getId();
        this.preco = estoque.getPreco();
        this.quantidade = estoque.getQuantidade();
        this.produtoId = estoque.getProduto().getId();
        this.produtoNome = estoque.getProduto().getNome();
        this.farmaciaId = estoque.getFarmacia().getId();
        this.farmaciaNome = estoque.getFarmacia().getNomeFantasia();
    }
}