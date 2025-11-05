package ucb.app.esculapy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ucb.app.esculapy.model.ItemPedido;

public interface ItemPedidoRepository extends JpaRepository<ItemPedido, Long> {
}