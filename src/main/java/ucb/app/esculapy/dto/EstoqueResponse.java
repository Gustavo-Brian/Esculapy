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
     * Isso nos permite expor apenas os dados necessários para o front-end.
     */
    public EstoqueResponse(EstoqueLojista estoque) {
        this.estoqueId = estoque.getId();
        this.preco = estoque.getPreco();
        this.quantidade = estoque.getQuantidade();

        // Dados do Produto (do catálogo)
        this.produtoId = estoque.getProduto().getId();
        this.produtoNome = estoque.getProduto().getNome();

        // Dados da Farmácia (vendedor)
        this.farmaciaId = estoque.getFarmacia().getId();
        this.farmaciaNome = estoque.getFarmacia().getNomeFantasia();
    }
}