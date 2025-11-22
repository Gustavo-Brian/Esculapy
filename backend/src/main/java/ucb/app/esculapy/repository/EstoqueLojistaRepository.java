package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.EstoqueLojista;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * Repositório JPA para a entidade {@link EstoqueLojista}.
 * Inclui métodos para consultas privadas (Admin Farmácia) e públicas (Cliente).
 */
public interface EstoqueLojistaRepository extends JpaRepository<EstoqueLojista, Long> {

    /**
     * Lista paginada do estoque privado (completo, independente de status ativo/quantidade) da farmácia.
     *
     * @param farmaciaId O ID da farmácia.
     * @param pageable As informações de paginação.
     * @return Uma página de itens de estoque.
     */
    Page<EstoqueLojista> findByFarmaciaId(Long farmaciaId, Pageable pageable);

    /**
     * Verifica se existe algum item de estoque ativo/inativo para um dado produto.
     *
     * @param produtoId O ID do produto.
     * @return True se existir algum item de estoque para o produto, false caso contrário.
     */
    boolean existsByProduto_Id(Long produtoId);

    /**
     * Busca um item de estoque específico por farmácia e produto.
     *
     * @param farmaciaId O ID da farmácia.
     * @param produtoId O ID do produto.
     * @return Um Optional contendo o item de estoque, se encontrado.
     */
    Optional<EstoqueLojista> findByFarmaciaIdAndProduto_Id(Long farmaciaId, Long produtoId);


    /**
     * Busca ofertas públicas (ativo=true, quantidade > 0) para um produto específico em todas as farmácias.
     * Faz um JOIN FETCH para produto e farmácia para evitar o problema N+1.
     *
     * @param produtoId O ID do produto.
     * @param pageable As informações de paginação.
     * @return Uma página de ofertas de estoque.
     */
    @Query(value = "SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE el.produto.id = :produtoId AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true",
            countQuery = "SELECT COUNT(el) FROM EstoqueLojista el WHERE el.produto.id = :produtoId AND el.ativo = true AND el.quantidade > 0 AND el.produto.ativo = true")
    Page<EstoqueLojista> findOfertasByProdutoId(@Param("produtoId") Long produtoId, Pageable pageable);

    /**
     * Busca estoque público (ativo=true, quantidade > 0) por nome do produto.
     *
     * @param nomeProduto O nome ou parte do nome do produto.
     * @param pageable As informações de paginação.
     * @return Uma página de itens de estoque.
     */
    @Query(value = "SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "JOIN FETCH el.farmacia f " +
            "WHERE p.nome LIKE %:nomeProduto% AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true",
            countQuery = "SELECT COUNT(el) FROM EstoqueLojista el JOIN el.produto p WHERE p.nome LIKE %:nomeProduto% AND el.ativo = true AND el.quantidade > 0 AND p.ativo = true")
    Page<EstoqueLojista> findByProdutoNomeContendo(@Param("nomeProduto") String nomeProduto, Pageable pageable);

    /**
     * Busca todo o estoque público (ativo=true) de uma farmácia específica.
     *
     * @param farmaciaId O ID da farmácia.
     * @param pageable As informações de paginação.
     * @return Uma página de itens de estoque.
     */
    @Query(value = "SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "WHERE el.farmacia.id = :farmaciaId AND el.ativo = true AND p.ativo = true",
            countQuery = "SELECT COUNT(el) FROM EstoqueLojista el WHERE el.farmacia.id = :farmaciaId AND el.ativo = true AND el.produto.ativo = true")
    Page<EstoqueLojista> findPublicoByFarmaciaId(@Param("farmaciaId") Long farmaciaId, Pageable pageable);

    /**
     * Busca um item de estoque específico para consulta pública (ativo=true).
     *
     * @param estoqueId O ID do item de estoque.
     * @return Um Optional contendo o item de estoque, se encontrado e ativo.
     */
    @Query("SELECT el FROM EstoqueLojista el " +
            "JOIN FETCH el.produto p " +
            "WHERE el.id = :estoqueId AND el.ativo = true AND p.ativo = true")
    Optional<EstoqueLojista> findPublicoById(@Param("estoqueId") Long estoqueId);
}