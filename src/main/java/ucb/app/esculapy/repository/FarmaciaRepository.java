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

/**
 * Repositório JPA para a entidade {@link Farmacia}.
 */
public interface FarmaciaRepository extends JpaRepository<Farmacia, Long> {
    Optional<Farmacia> findByCnpj(String cnpj);
    Optional<Farmacia> findByCrfJ(String crfJ);
    Boolean existsByCnpj(String cnpj);
    Boolean existsByCrfJ(String crfJ);
    Optional<Farmacia> findByUsuarioAdminId(Long usuarioId);

    /**
     * Busca farmácias por status para uso administrativo (paginado).
     *
     * @param status O status do lojista (ex: PENDENTE_APROVACAO).
     * @param pageable As informações de paginação.
     * @return Uma página de farmácias.
     */
    Page<Farmacia> findByStatus(LojistaStatus status, Pageable pageable);

    /**
     * Busca farmácias ativas para consulta pública, incluindo o endereço comercial no fetch para evitar N+1.
     *
     * @param status O status (deve ser ATIVO).
     * @param pageable As informações de paginação.
     * @return Uma página de farmácias.
     */
    @Query(value = "SELECT f FROM Farmacia f LEFT JOIN FETCH f.enderecoComercial WHERE f.status = :status",
            countQuery = "SELECT COUNT(f) FROM Farmacia f WHERE f.status = :status")
    Page<Farmacia> findAllByStatusComEndereco(@Param("status") LojistaStatus status, Pageable pageable);

    /**
     * Busca os detalhes de uma farmácia específica, garantindo que ela esteja ATIVA e incluindo o endereço.
     *
     * @param id O ID da farmácia.
     * @return Um Optional contendo a farmácia, se encontrada e ativa.
     */
    @Query("SELECT f FROM Farmacia f LEFT JOIN FETCH f.enderecoComercial WHERE f.id = :id AND f.status = 'ATIVO'")
    Optional<Farmacia> findPublicaById(@Param("id") Long id);
}