package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * Entidade que representa o estoque de um produto em uma farmácia específica.
 * A combinação farmacia_id e produto_id é única.
 */
@Entity
@Table(name = "estoque_lojista", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"farmacia_id", "produto_id"})
})
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class EstoqueLojista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farmacia_id")
    private Farmacia farmacia;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer quantidade;

    @Column(nullable = false)
    private boolean ativo = true;

    /**
     * Expõe o ID do produto na serialização JSON
     * Mantém o campo 'produto' com @JsonIgnore para evitar lazy loading issues
     */
    @JsonProperty("produtoId")
    public Long getProdutoId() {
        return produto != null ? produto.getId() : null;
    }
}