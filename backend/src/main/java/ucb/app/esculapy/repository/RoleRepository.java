package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repositório JPA para a entidade {@link Role}.
 */
public interface RoleRepository extends JpaRepository<Role, Long> {
    /**
     * Busca uma Role pelo seu nome (ex: "ROLE_ADMIN").
     *
     * @param nome O nome da Role.
     * @return Um Optional contendo a Role.
     */
    Optional<Role> findByNome(String nome);
}