package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contas_bancarias")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ContaBancaria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String codigoBanco;

    @Column(nullable = false)
    private String agencia;

    @Column(nullable = false)
    private String numeroConta;

    @Column(nullable = false)
    private String digitoVerificador;

    @Column(nullable = false)
    private String tipoConta; // "CORRENTE" ou "POUPANCA"

    @Column(nullable = false)
    private String documentoTitular; // CPF ou CNPJ do titular

    @Column(nullable = false)
    private String nomeTitular;

    @JsonIgnore
    @OneToOne(mappedBy = "contaBancaria", fetch = FetchType.LAZY)
    private Farmacia farmacia;
}