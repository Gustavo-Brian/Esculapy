package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ucb.app.esculapy.model.enums.LojistaStatus;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "farmacias", uniqueConstraints = {
        @UniqueConstraint(columnNames = "cnpj"),
        @UniqueConstraint(columnNames = "crfJ")
})
@Getter
@Setter
@NoArgsConstructor
public class Farmacia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cnpj;

    @Column(nullable = false)
    private String razaoSocial;

    @Column(nullable = false)
    private String nomeFantasia;

    @Column(nullable = false, unique = true)
    private String crfJ; // CRF da Pessoa Jurídica (Farmácia)

    @Column(nullable = false)
    private String emailContato;

    @Column(nullable = false)
    private String numeroCelularContato;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCadastro = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LojistaStatus status = LojistaStatus.PENDENTE_APROVACAO;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "usuario_admin_id", referencedColumnName = "id", unique = true)
    private Usuario usuarioAdmin;

    @JsonIgnore // Carregar sob demanda
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "endereco_comercial_id", referencedColumnName = "id")
    private Endereco enderecoComercial;

    @JsonIgnore // Carregar sob demanda
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JoinColumn(name = "conta_bancaria_id", referencedColumnName = "id")
    private ContaBancaria contaBancaria;

    @JsonIgnore
    @OneToMany(mappedBy = "farmacia", fetch = FetchType.LAZY)
    private List<Farmaceutico> farmaceuticos = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "farmacia", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<EstoqueLojista> estoques = new ArrayList<>();
}