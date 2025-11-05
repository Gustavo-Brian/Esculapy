package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Farmaceutico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FarmaceuticoRepository extends JpaRepository<Farmaceutico, Long> {
    Optional<Farmaceutico> findByCpf(String cpf);
    Optional<Farmaceutico> findByCrfP(String crfP);
    Boolean existsByCpf(String cpf);
    Boolean existsByCrfP(String crfP);
}