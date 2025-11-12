package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.EstoqueLojista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EstoqueLojistaRepository extends JpaRepository<EstoqueLojista, Long> {

    List<EstoqueLojista> findByFarmaciaId(Long farmaciaId);
    boolean existsByProdutoId(Long produtoId);

    // --- QUERY ATUALIZADA (Otimizada) ---
    // Adicionada verificação de p.ativo = true
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE el.produto.id = :produtoId AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true")
    List<EstoqueLojista> findOfertasByProdutoId(@Param("produtoId") Long produtoId);

    // --- QUERY ATUALIZADA (Otimizada) ---
    // Adicionada verificação de p.ativo = true
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE p.nome LIKE %:nomeProduto% AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true")
    List<EstoqueLojista> findByProdutoNomeContendo(@Param("nomeProduto") String nomeProduto);

    Optional<EstoqueLojista> findByFarmaciaIdAndProdutoId(Long farmaciaId, Long produtoId);
}