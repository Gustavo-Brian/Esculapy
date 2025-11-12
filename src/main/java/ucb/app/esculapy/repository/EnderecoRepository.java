package ucb.app.esculapy.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ucb.app.esculapy.model.Endereco;
import java.util.List;
import java.util.Optional;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    // Método útil para o cliente listar seus endereços
    List<Endereco> findByClienteId(Long clienteId);

    // Você pode adicionar um método para buscar um endereço de cliente específico
    Optional<Endereco> findByIdAndClienteId(Long id, Long clienteId);
}