package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    Optional<Cliente> findByCpf(String cpf);
    Boolean existsByCpf(String cpf);
    Optional<Cliente> findByUsuarioId(Long usuarioId);
}