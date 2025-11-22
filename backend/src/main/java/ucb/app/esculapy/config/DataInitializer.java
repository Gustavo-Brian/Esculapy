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

/**
 * Componente de inicialização de dados que executa tarefas ao iniciar a aplicação.
 * Responsável por garantir a existência de roles básicas e criar um usuário administrador mestre
 * se não houver usuários cadastrados.
 */
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Executa a lógica de inicialização de dados.
     *
     * @param args Argumentos de linha de comando.
     * @throws Exception Se ocorrer um erro durante a execução.
     */
    @Override
    public void run(String... args) throws Exception {

        garantirRole("ROLE_CLIENTE");
        garantirRole("ROLE_LOJISTA_ADMIN");
        garantirRole("ROLE_FARMACEUTICO");
        garantirRole("ROLE_ADMIN");

        if (usuarioRepository.count() == 0) {
            String senhaPadrao = UUID.randomUUID().toString().substring(0, 8);
            String emailPadrao = "admin_" + UUID.randomUUID().toString().substring(0, 4) + "@esculapy.com";

            Role adminRole = roleRepository.findByNome("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN não encontrada."));

            Usuario adminUser = new Usuario(
                    emailPadrao,
                    passwordEncoder.encode(senhaPadrao)
            );
            adminUser.setRoles(Set.of(adminRole));
            usuarioRepository.save(adminUser);

            System.out.println("------------------------------------------------------------------");
            System.out.println(">>> USUÁRIO ADMIN MASTER CRIADO");
            System.out.println(">>> E-mail: " + adminUser.getEmail());
            System.out.println(">>> Senha: " + senhaPadrao);
            System.out.println("------------------------------------------------------------------");
        }
    }

    /**
     * Verifica e garante que uma Role com o nome especificado existe no banco de dados.
     * Se não existir, a Role é criada.
     *
     * @param nomeRole O nome da Role (ex: "ROLE_ADMIN").
     */
    private void garantirRole(String nomeRole) {
        if (roleRepository.findByNome(nomeRole).isEmpty()) {
            roleRepository.save(new Role(nomeRole));
        }
    }
}