package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Farmaceutico;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repositório JPA para a entidade {@link Farmaceutico}.
 */
public interface FarmaceuticoRepository extends JpaRepository<Farmaceutico, Long> {
    Optional<Farmaceutico> findByCpf(String cpf);
    Optional<Farmaceutico> findByCrfP(String crfP);
    Boolean existsByCpf(String cpf);
    Boolean existsByCrfP(String crfP);

    /**
     * Lista paginada de farmacêuticos associados a uma farmácia específica.
     *
     * @param farmaciaId O ID da farmácia.
     * @param pageable As informações de paginação.
     * @return Uma página de farmacêuticos.
     */
    Page<Farmaceutico> findAllByFarmaciaId(Long farmaciaId, Pageable pageable);
}