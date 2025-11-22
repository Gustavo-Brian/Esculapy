package ucb.app.esculapy.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.model.enums.PedidoStatus;

import java.util.Optional;

/**
 * Repositório JPA para a entidade {@link Pedido}.
 */
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    /**
     * Lista paginada de pedidos realizados por um cliente específico.
     *
     * @param clienteId O ID do cliente.
     * @param pageable As informações de paginação.
     * @return Uma página de pedidos.
     */
    Page<Pedido> findByClienteId(Long clienteId, Pageable pageable);

    /**
     * Busca pedidos que estão em um status específico e pertencem a uma farmácia, com suporte a paginação.
     *
     * @param status O status do pedido (ex: AGUARDANDO_RECEITA).
     * @param farmaciaId O ID da farmácia.
     * @param pageable As informações de paginação.
     * @return Uma página de pedidos filtrados.
     */
    @Query(value = "SELECT DISTINCT p FROM Pedido p " +
            "JOIN p.itens i " +
            "JOIN i.estoqueLojista el " +
            "WHERE p.status = :status AND el.farmacia.id = :farmaciaId",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Pedido p JOIN p.itens i JOIN i.estoqueLojista el WHERE p.status = :status AND el.farmacia.id = :farmaciaId")
    Page<Pedido> findPedidosPorStatusEFarmacia(
            @Param("status") PedidoStatus status,
            @Param("farmaciaId") Long farmaciaId,
            Pageable pageable
    );

    /**
     * Busca todos os pedidos associados a uma farmácia, com suporte a paginação.
     *
     * @param farmaciaId O ID da farmácia.
     * @param pageable As informações de paginação.
     * @return Uma página de todos os pedidos da farmácia.
     */
    @Query(value = "SELECT DISTINCT p FROM Pedido p " +
            "JOIN p.itens i " +
            "JOIN i.estoqueLojista el " +
            "WHERE el.farmacia.id = :farmaciaId",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Pedido p JOIN p.itens i JOIN i.estoqueLojista el WHERE el.farmacia.id = :farmaciaId")
    Page<Pedido> findAllByFarmaciaId(@Param("farmaciaId") Long farmaciaId, Pageable pageable);

    /**
     * Busca um pedido específico para validação, garantindo que ele esteja no status correto
     * e pertence à farmácia do usuário logado.
     * Faz um FETCH nos itens e estoque para evitar N+1.
     *
     * @param pedidoId O ID do pedido.
     * @param status O status esperado para validação.
     * @param farmaciaId O ID da farmácia.
     * @return Um Optional contendo o pedido, se encontrado.
     */
    @Query("SELECT DISTINCT p FROM Pedido p " +
            "JOIN FETCH p.itens i " +
            "JOIN FETCH i.estoqueLojista el " +
            "WHERE p.id = :pedidoId " +
            "AND p.status = :status " +
            "AND el.farmacia.id = :farmaciaId")
    Optional<Pedido> findPedidoParaValidacao(
            @Param("pedidoId") Long pedidoId,
            @Param("status") PedidoStatus status,
            @Param("farmaciaId") Long farmaciaId
    );
}