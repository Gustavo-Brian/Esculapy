package ucb.app.esculapy.repository;

import ucb.app.esculapy.model.Usuario;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Otimizado: Ao buscar por email, já traz os perfis e roles
    // Isso é crucial para o AuthenticationService e o /api/user/me
    @EntityGraph(attributePaths = {"roles", "cliente", "farmaciaAdmin", "farmaceutico"})
    Optional<Usuario> findByEmail(String email);

    Boolean existsByEmail(String email);
}