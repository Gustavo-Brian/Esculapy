package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.EstoqueLojista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EstoqueLojistaRepository extends JpaRepository<EstoqueLojista, Long> {

    // --- Métodos para Lógica de Admin/Privada ---
    List<EstoqueLojista> findByFarmaciaId(Long farmaciaId);
    boolean existsByProdutoId(Long produtoId);
    Optional<EstoqueLojista> findByFarmaciaIdAndProdutoId(Long farmaciaId, Long produtoId);


    // --- Métodos para Lógica Pública (Filtrando por ativos) ---

    // Query original (usada em /api/estoque/buscar-por-catalogo/{id})
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE el.produto.id = :produtoId AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true")
    List<EstoqueLojista> findOfertasByProdutoId(@Param("produtoId") Long produtoId);

    // Query original (usada em /api/estoque/buscar-por-nome)
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE p.nome LIKE %:nomeProduto% AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true")
    List<EstoqueLojista> findByProdutoNomeContendo(@Param("nomeProduto") String nomeProduto);

    /**
     * NOVO MÉTODO (Público)
     * Busca o estoque de uma farmácia específica, garantindo que o estoque e o
     * produto estejam ativos.
     */
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "WHERE el.farmacia.id = :farmaciaId AND el.ativo = true AND p.ativo = true")
    List<EstoqueLojista> findPublicoByFarmaciaId(@Param("farmaciaId") Long farmaciaId);

    /**
     * NOVO MÉTODO (Público)
     * Busca um item de estoque específico, garantindo que ele e seu produto
     * estejam ativos.
     */
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "WHERE el.id = :estoqueId AND el.ativo = true AND p.ativo = true")
    Optional<EstoqueLojista> findPublicoById(@Param("estoqueId") Long estoqueId);
}