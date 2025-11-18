package ucb.app.esculapy.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.model.enums.PedidoStatus;

import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // Lista paginada para o cliente
    Page<Pedido> findByClienteId(Long clienteId, Pageable pageable);

    // Busca pedidos de um status específico para uma farmácia (Paginado)
    // Útil para o Farmacêutico (ver pendentes)
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

    // Busca todos os pedidos de uma farmácia (Paginado)
    // Útil para o Lojista Admin
    @Query(value = "SELECT DISTINCT p FROM Pedido p " +
            "JOIN p.itens i " +
            "JOIN i.estoqueLojista el " +
            "WHERE el.farmacia.id = :farmaciaId",
            countQuery = "SELECT COUNT(DISTINCT p) FROM Pedido p JOIN p.itens i JOIN i.estoqueLojista el WHERE el.farmacia.id = :farmaciaId")
    Page<Pedido> findAllByFarmaciaId(@Param("farmaciaId") Long farmaciaId, Pageable pageable);

    // Busca um pedido específico para validação (Single Result)
    // Garante que o pedido pertence à farmácia e está no status correto
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