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
import java.util.UUID; // <-- Import para gerar dados randômicos

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    // Repositórios necessários para as entidades (Roles e Usuários)
    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // 1. GARANTIR ROLES BÁSICAS
        if (roleRepository.findByNome("ROLE_CLIENTE").isEmpty()) {
            roleRepository.save(new Role("ROLE_CLIENTE"));
        }
        if (roleRepository.findByNome("ROLE_LOJISTA_ADMIN").isEmpty()) {
            roleRepository.save(new Role("ROLE_LOJISTA_ADMIN"));
        }
        if (roleRepository.findByNome("ROLE_FARMACEUTICO").isEmpty()) {
            roleRepository.save(new Role("ROLE_FARMACEUTICO"));
        }
        if (roleRepository.findByNome("ROLE_ADMIN").isEmpty()) {
            roleRepository.save(new Role("ROLE_ADMIN"));
        }

        // 2. CRIAR USUÁRIO ADMIN MASTER RANDÔMICO PARA TESTES

        // Geramos um e-mail e senha novos a cada execução
        String senhaPadrao = UUID.randomUUID().toString().substring(0, 8);
        String emailPadrao = "admin_" + UUID.randomUUID().toString().substring(0, 8) + "@esculapy.com";

        // Criamos o usuário somente se NENHUM usuário ADMIN já existir (para evitar sobrecarga em produção)
        if (usuarioRepository.findByEmail(emailPadrao).isEmpty() && usuarioRepository.count() < 10) { // Verifica se o DB está relativamente vazio

            Role adminRole = roleRepository.findByNome("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN não encontrada."));

            Usuario adminUser = new Usuario(
                    emailPadrao,
                    passwordEncoder.encode(senhaPadrao) // Senha codificada
            );
            adminUser.setRoles(Set.of(adminRole));

            usuarioRepository.save(adminUser);

            // 3. IMPRESSÃO INTERATIVA NO CONSOLE
            System.out.println("------------------------------------------------------------------");
            System.out.println(">>> USUÁRIO ADMIN MASTER CRIADO (RANDÔMICO) <<<");
            System.out.println(">>> E-mail: " + adminUser.getEmail());
            System.out.println(">>> Senha: " + senhaPadrao); // Imprime a senha CLARA para o usuário logar
            System.out.println("------------------------------------------------------------------");
        }
    }
}