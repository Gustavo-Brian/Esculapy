package ucb.app.esculapy.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ucb.app.esculapy.model.Endereco;
import java.util.Optional;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    // Método paginado para o cliente listar seus endereços
    Page<Endereco> findByClienteId(Long clienteId, Pageable pageable);

    // Busca um endereço específico garantindo que pertence ao cliente
    Optional<Endereco> findByIdAndClienteId(Long id, Long clienteId);
}