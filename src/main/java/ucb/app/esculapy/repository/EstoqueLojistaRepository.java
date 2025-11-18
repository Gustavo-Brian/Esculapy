package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.EstoqueLojista;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EstoqueLojistaRepository extends JpaRepository<EstoqueLojista, Long> {

    // --- Métodos para Lógica de Admin/Privada ---

    // Lista paginada do estoque privado da farmácia
    Page<EstoqueLojista> findByFarmaciaId(Long farmaciaId, Pageable pageable);

    boolean existsByProdutoId(Long produtoId);

    Optional<EstoqueLojista> findByFarmaciaIdAndProdutoId(Long farmaciaId, Long produtoId);


    // --- Métodos para Lógica Pública (Filtrando por ativos) ---

    // Busca ofertas de um produto específico (Paginado)
    @Query(value = "SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE el.produto.id = :produtoId AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true",
            countQuery = "SELECT COUNT(el) FROM EstoqueLojista el WHERE el.produto.id = :produtoId AND el.ativo = true AND el.quantidade > 0 AND el.produto.ativo = true")
    Page<EstoqueLojista> findOfertasByProdutoId(@Param("produtoId") Long produtoId, Pageable pageable);

    // Busca estoque por nome do produto (Paginado)
    @Query(value = "SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE p.nome LIKE %:nomeProduto% AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true",
            countQuery = "SELECT COUNT(el) FROM EstoqueLojista el JOIN el.produto p WHERE p.nome LIKE %:nomeProduto% AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true")
    Page<EstoqueLojista> findByProdutoNomeContendo(@Param("nomeProduto") String nomeProduto, Pageable pageable);

    // Busca todo o estoque público de uma farmácia (Paginado)
    @Query(value = "SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "WHERE el.farmacia.id = :farmaciaId AND el.ativo = true AND p.ativo = true",
            countQuery = "SELECT COUNT(el) FROM EstoqueLojista el WHERE el.farmacia.id = :farmaciaId AND el.ativo = true AND el.produto.ativo = true")
    Page<EstoqueLojista> findPublicoByFarmaciaId(@Param("farmaciaId") Long farmaciaId, Pageable pageable);

    // Busca item específico (sem paginação, retorno único)
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "WHERE el.id = :estoqueId AND el.ativo = true AND p.ativo = true")
    Optional<EstoqueLojista> findPublicoById(@Param("estoqueId") Long estoqueId);
}