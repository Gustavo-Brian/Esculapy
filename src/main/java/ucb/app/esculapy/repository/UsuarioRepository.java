package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Ao buscar por email, já traz os perfis
    @EntityGraph(attributePaths = {"roles", "cliente", "farmaciaAdmin", "farmaceutico"})
    Optional<Usuario> findByEmail(String email);

    Boolean existsByEmail(String email);
}