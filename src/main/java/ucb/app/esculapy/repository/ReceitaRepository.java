package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositório JPA para a entidade {@link Receita}.
 */
public interface ReceitaRepository extends JpaRepository<Receita, Long> {
}