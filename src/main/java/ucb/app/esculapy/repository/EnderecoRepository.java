package ucb.app.esculapy.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import ucb.app.esculapy.model.Endereco;
import java.util.Optional;

/**
 * Repositório JPA para a entidade {@link Endereco}.
 */
public interface EnderecoRepository extends JpaRepository<Endereco, Long> {

    /**
     * Lista paginada dos endereços de um cliente específico.
     *
     * @param clienteId O ID do cliente.
     * @param pageable As informações de paginação.
     * @return Uma página de endereços.
     */
    Page<Endereco> findByClienteId(Long clienteId, Pageable pageable);

    /**
     * Busca um endereço específico garantindo que pertence a um cliente.
     *
     * @param id O ID do endereço.
     * @param clienteId O ID do cliente.
     * @return Um Optional contendo o endereço, se encontrado e pertencente ao cliente.
     */
    Optional<Endereco> findByIdAndClienteId(Long id, Long clienteId);
}