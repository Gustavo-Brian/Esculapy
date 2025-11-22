package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * Repositório JPA para a entidade {@link Usuario}.
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    /**
     * Busca um usuário pelo e-mail, carregando antecipadamente (Eagerly) as Roles e todos os perfis
     * associados (Cliente, FarmaciaAdmin, Farmaceutico) usando {@link EntityGraph}.
     *
     * @param email O e-mail do usuário.
     * @return Um Optional contendo o Usuário com seus dados de perfil carregados.
     */
    @EntityGraph(attributePaths = {"roles", "cliente", "farmaciaAdmin", "farmaceutico"})
    Optional<Usuario> findByEmail(String email);

    Boolean existsByEmail(String email);
}