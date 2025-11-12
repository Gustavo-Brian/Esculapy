package ucb.app.esculapy.model;

import ucb.app.esculapy.model.enums.TipoProduto;
import ucb.app.esculapy.model.enums.TipoReceita;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "produtos_catalogo", uniqueConstraints = {
        @UniqueConstraint(columnNames = "ean"),
        @UniqueConstraint(columnNames = "codigoRegistroMS")
})
@Getter
@Setter
@NoArgsConstructor
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

    // --- CAMPO ADICIONADO ---
    @Column(nullable = false)
    private boolean ativo = true;
}