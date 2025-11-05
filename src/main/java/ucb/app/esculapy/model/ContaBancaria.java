package ucb.app.esculapy.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "contas_bancarias")
@Getter
@Setter
@NoArgsConstructor
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

    @OneToOne(mappedBy = "contaBancaria", fetch = FetchType.LAZY)
    private Farmacia farmacia; // Atualizado para Farmacia
}