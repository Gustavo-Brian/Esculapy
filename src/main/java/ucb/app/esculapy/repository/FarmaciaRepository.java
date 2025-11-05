package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.enums.LojistaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface FarmaciaRepository extends JpaRepository<Farmacia, Long> {
    Optional<Farmacia> findByCnpj(String cnpj);
    Optional<Farmacia> findByCrfJ(String crfJ);
    Boolean existsByCnpj(String cnpj);
    Boolean existsByCrfJ(String crfJ);
    Optional<Farmacia> findByUsuarioAdminId(Long usuarioId);
    List<Farmacia> findByStatus(LojistaStatus status);
}