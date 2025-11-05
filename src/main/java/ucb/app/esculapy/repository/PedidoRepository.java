package ucb.app.esculapy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // <-- IMPORTE ISSO
import org.springframework.data.repository.query.Param; // <-- IMPORTE ISSO
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.model.enums.PedidoStatus;

import java.util.List;
import java.util.Optional; // <-- IMPORTE ISSO

public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByStatus(PedidoStatus status);
    List<Pedido> findByClienteId(Long clienteId);

    // --- MÉTODO NOVO (Otimizado para buscarPendentes) ---
    // Busca apenas os pedidos que (a) têm o status correto E (b) contêm
    // pelo menos um item da farmácia especificada.
    @Query("SELECT DISTINCT p FROM Pedido p " +
            "JOIN p.itens i " +
            "JOIN i.estoqueLojista el " +
            "WHERE p.status = :status AND el.farmacia.id = :farmaciaId")
    List<Pedido> findPedidosPorStatusEFarmacia(
            @Param("status") PedidoStatus status,
            @Param("farmaciaId") Long farmaciaId
    );

    // --- MÉTODO NOVO (Otimizado para getPedidoValidado) ---
    // Busca um pedido específico, já validando o status e a posse pela farmácia,
    // e já carrega os itens e o estoque (JOIN FETCH) para a lógica de estorno.
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