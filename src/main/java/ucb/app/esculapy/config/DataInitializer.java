package ucb.app.esculapy.config;

import ucb.app.esculapy.model.Role;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.repository.RoleRepository;
import ucb.app.esculapy.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // 1. GARANTIR ROLES BÁSICAS
        garantirRole("ROLE_CLIENTE");
        garantirRole("ROLE_LOJISTA_ADMIN");
        garantirRole("ROLE_FARMACEUTICO");
        garantirRole("ROLE_ADMIN");

        // 2. CRIAR USUÁRIO ADMIN MASTER RANDÔMICO PARA TESTES
        String senhaPadrao = UUID.randomUUID().toString().substring(0, 8);
        String emailPadrao = "admin_" + UUID.randomUUID().toString().substring(0, 4) + "@esculapy.com";

        if (usuarioRepository.count() == 0) { // Cria apenas se o banco estiver vazio
            Role adminRole = roleRepository.findByNome("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN não encontrada."));

            Usuario adminUser = new Usuario(
                    emailPadrao,
                    passwordEncoder.encode(senhaPadrao)
            );
            adminUser.setRoles(Set.of(adminRole));
            usuarioRepository.save(adminUser);

            System.out.println("------------------------------------------------------------------");
            System.out.println(">>> USUÁRIO ADMIN MASTER CRIADO (BANCO VAZIO) <<<");
            System.out.println(">>> E-mail: " + adminUser.getEmail());
            System.out.println(">>> Senha: " + senhaPadrao);
            System.out.println("------------------------------------------------------------------");
        }
    }

    private void garantirRole(String nomeRole) {
        if (roleRepository.findByNome(nomeRole).isEmpty()) {
            roleRepository.save(new Role(nomeRole));
        }
    }
}