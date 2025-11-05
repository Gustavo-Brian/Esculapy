package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore; // <-- IMPORT NECESSÁRIO
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;

@Entity
@Table(name = "estoque_lojista", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"farmacia_id", "produto_id"})
})
@Getter
@Setter
@NoArgsConstructor
public class EstoqueLojista {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Ligação com a farmácia
    @JsonIgnore // <-- (CONSERTA O ERRO ANTERIOR: Ignora a Farmácia)
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farmacia_id")
    private Farmacia farmacia;

    // Ligação com o produto do catálogo
    @JsonIgnore // <-- CORREÇÃO FINAL: Ignora o Produto (resolve o erro 'ByteBuddyInterceptor')
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @Column(nullable = false)
    private BigDecimal preco;

    @Column(nullable = false)
    private Integer quantidade;

    private boolean ativo = true;
}