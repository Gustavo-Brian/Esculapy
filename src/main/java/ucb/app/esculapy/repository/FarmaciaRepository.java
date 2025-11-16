package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.enums.LojistaStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Add import

import java.util.List;
import java.util.Optional;

public interface FarmaciaRepository extends JpaRepository<Farmacia, Long> {
    Optional<Farmacia> findByCnpj(String cnpj);
    Optional<Farmacia> findByCrfJ(String crfJ);
    Boolean existsByCnpj(String cnpj);
    Boolean existsByCrfJ(String crfJ);
    Optional<Farmacia> findByUsuarioAdminId(Long usuarioId);
    List<Farmacia> findByStatus(LojistaStatus status);

    // --- MÉTODOS ADICIONADOS ---

    /**
     * Busca farmácias ATIVAS e já carrega (FETCH) o endereço
     * para evitar queries N+1.
     */
    @Query("SELECT f FROM Farmacia f LEFT JOIN FETCH f.enderecoComercial WHERE f.status = :status")
    List<Farmacia> findAllByStatusComEndereco(LojistaStatus status);

    @Query("SELECT f FROM Farmacia f LEFT JOIN FETCH f.enderecoComercial WHERE f.id = :id AND f.status = 'ATIVO'")
    Optional<Farmacia> findPublicaById(Long id);
}