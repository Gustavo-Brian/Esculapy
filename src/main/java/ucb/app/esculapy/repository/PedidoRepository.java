package ucb.app.esculapy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.model.enums.PedidoStatus;

import java.util.List;
import java.util.Optional;

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByStatus(PedidoStatus status);
    List<Pedido> findByClienteId(Long clienteId);

    // Otimizado: Busca pedidos de um status que pertençam a uma farmácia
    @Query("SELECT DISTINCT p FROM Pedido p " +
            "JOIN p.itens i " +
            "JOIN i.estoqueLojista el " +
            "WHERE p.status = :status AND el.farmacia.id = :farmaciaId")
    List<Pedido> findPedidosPorStatusEFarmacia(
            @Param("status") PedidoStatus status,
            @Param("farmaciaId") Long farmaciaId
    );

    // Otimizado: Busca um pedido específico para validação, checando posse
    // e carregando dados necessários para o estorno (itens e estoque).
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