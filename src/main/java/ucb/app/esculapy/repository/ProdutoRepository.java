package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repositório JPA para a entidade {@link Produto} (Catálogo Mestre).
 */
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findByEan(String ean);
    Optional<Produto> findByCodigoRegistroMS(String codigo);

    /**
     * Lista paginada de todos os produtos que estão marcados como ativos.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de produtos ativos.
     */
    Page<Produto> findAllByAtivoTrue(Pageable pageable);
}