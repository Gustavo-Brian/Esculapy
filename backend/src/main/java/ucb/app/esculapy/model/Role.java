package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entidade que representa uma Role (Permissão) na aplicação (ex: ROLE_ADMIN, ROLE_CLIENTE).
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 60, unique = true)
    private String nome;

    /**
     * Construtor para criação de uma nova Role.
     *
     * @param nome O nome da Role (deve começar com "ROLE_").
     */
    public Role(String nome) {
        this.nome = nome;
    }
}