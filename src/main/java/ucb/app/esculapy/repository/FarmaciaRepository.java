package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.enums.LojistaStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FarmaciaRepository extends JpaRepository<Farmacia, Long> {
    Optional<Farmacia> findByCnpj(String cnpj);
    Optional<Farmacia> findByCrfJ(String crfJ);
    Boolean existsByCnpj(String cnpj);
    Boolean existsByCrfJ(String crfJ);
    Optional<Farmacia> findByUsuarioAdminId(Long usuarioId);

    // Busca administrativa paginada
    Page<Farmacia> findByStatus(LojistaStatus status, Pageable pageable);

    // Busca pública paginada (trazendo endereço para evitar N+1)
    @Query(value = "SELECT f FROM Farmacia f LEFT JOIN FETCH f.enderecoComercial WHERE f.status = :status",
            countQuery = "SELECT COUNT(f) FROM Farmacia f WHERE f.status = :status")
    Page<Farmacia> findAllByStatusComEndereco(@Param("status") LojistaStatus status, Pageable pageable);

    // Busca pública de detalhes
    @Query("SELECT f FROM Farmacia f LEFT JOIN FETCH f.enderecoComercial WHERE f.id = :id AND f.status = 'ATIVO'")
    Optional<Farmacia> findPublicaById(@Param("id") Long id);
}