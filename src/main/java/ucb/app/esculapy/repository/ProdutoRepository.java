package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findByEan(String ean);
    Optional<Produto> findByCodigoRegistroMS(String codigo);

    // Listagem paginada do catálogo público
    Page<Produto> findAllByAtivoTrue(Pageable pageable);
}