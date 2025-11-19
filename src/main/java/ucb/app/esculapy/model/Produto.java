package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import ucb.app.esculapy.model.enums.TipoProduto;
import ucb.app.esculapy.model.enums.TipoReceita;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa um Produto no Catálogo Mestre da plataforma.
 */
@Entity
@Table(name = "produtos_catalogo", uniqueConstraints = {
        @UniqueConstraint(columnNames = "ean"),
        @UniqueConstraint(columnNames = "codigoRegistroMS")
})
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String ean;

    @Column(nullable = false)
    private String nome;

    private String principioAtivo;

    private String laboratorio;

    @Column(length = 1000)
    private String descricao;

    @Column(nullable = false, unique = true)
    private String codigoRegistroMS;

    private String bulaUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoProduto tipoProduto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoReceita tipoReceita;

    @Column(nullable = false)
    private boolean ativo = true;
}