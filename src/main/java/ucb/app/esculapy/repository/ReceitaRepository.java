package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Receita;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReceitaRepository extends JpaRepository<Receita, Long> {
}