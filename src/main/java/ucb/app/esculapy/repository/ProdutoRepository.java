package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List; // Importar List
import java.util.Optional;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    Optional<Produto> findByEan(String ean);
    Optional<Produto> findByCodigoRegistroMS(String codigo);

    // NOVO MÉTODO para CatalogoController (GET /api/catalogo)
    List<Produto> findAllByAtivoTrue();
}