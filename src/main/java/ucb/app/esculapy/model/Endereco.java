package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "enderecos")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cep;
    private String logradouro;
    private String numero;
    private String complemento;
    private String bairro;
    private String cidade;
    private String estado;

    /**
     * Tipo do endereço, ex: "CASA", "TRABALHO" (para Cliente)
     * ou "COMERCIAL" (para Farmacia)
     */
    private String tipo;

    // --- BLOCO ADICIONADO ---
    @JsonIgnore // Para evitar loops infinitos na serialização JSON
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id") // Esta é a coluna do banco de dados
    private Cliente cliente;
    // --- FIM DO BLOCO ---
}