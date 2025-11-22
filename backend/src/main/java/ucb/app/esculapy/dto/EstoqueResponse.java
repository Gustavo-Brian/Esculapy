package ucb.app.esculapy.dto;

import lombok.Getter;
import lombok.Setter;
import ucb.app.esculapy.model.EstoqueLojista;

import java.math.BigDecimal;

/**
 * DTO de resposta para consulta de itens de estoque disponíveis ao público.
 * Inclui informações do produto e da farmácia onde o item está estocado.
 */
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
    private boolean ativo;

    /**
     * Construtor que mapeia a entidade {@link EstoqueLojista} para este DTO.
     *
     * @param estoque A entidade EstoqueLojista.
     */
    public EstoqueResponse(EstoqueLojista estoque) {
        this.estoqueId = estoque.getId();
        this.preco = estoque.getPreco();
        this.quantidade = estoque.getQuantidade();
        this.ativo = estoque.isAtivo();
        this.produtoId = estoque.getProduto().getId();
        this.produtoNome = estoque.getProduto().getNome();
        this.farmaciaId = estoque.getFarmacia().getId();
        this.farmaciaNome = estoque.getFarmacia().getNomeFantasia();
    }
}