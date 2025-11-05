package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.EstoqueLojista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param; // <-- IMPORTE ISSO

import java.util.List;
import java.util.Optional;

public interface EstoqueLojistaRepository extends JpaRepository<EstoqueLojista, Long> {

    List<EstoqueLojista> findByFarmaciaId(Long farmaciaId);

    // --- QUERY ATUALIZADA (Otimizada) ---
    // Busca todas as ofertas para um produto específico (trazendo Produto e Farmácia)
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE el.produto.id = :produtoId AND el.ativo = true AND el.quantidade > 0")
    List<EstoqueLojista> findOfertasByProdutoId(@Param("produtoId") Long produtoId);

    // --- QUERY ATUALIZADA (Otimizada) ---
    // Query para buscar farmácias que vendem um produto pelo nome (trazendo Produto e Farmácia)
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE p.nome LIKE %:nomeProduto% AND el.ativo = true AND el.quantidade > 0")
    List<EstoqueLojista> findByProdutoNomeContendo(@Param("nomeProduto") String nomeProduto);

    // (Este foi adicionado para o EstoqueService)
    Optional<EstoqueLojista> findByFarmaciaIdAndProdutoId(Long farmaciaId, Long produtoId);
}