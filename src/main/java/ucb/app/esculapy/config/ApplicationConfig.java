package ucb.app.esculapy.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import ucb.app.esculapy.repository.UsuarioRepository;
import ucb.app.esculapy.service.StorageService;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UsuarioRepository usuarioRepository;

    /**
     * Define como o Spring Security deve carregar um usuário.
     * Ele usa o UsuarioRepository para buscar por e-mail.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + username));
    }

    /**
     * Define o provedor de autenticação.
     * Ele informa ao Spring para usar o userDetailsService (para buscar)
     * e o passwordEncoder (para comparar as senhas).
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Expõe o AuthenticationManager como um Bean.
     * Este é o bean que o AuthService injeta para processar o login.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Define o algoritmo de criptografia de senhas.
     * Usar BCrypt é o padrão moderno.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Bean ADICIONADO (estava no seu arquivo):
     * Inicializa o serviço de storage (cria a pasta 'uploads' se necessário)
     * quando a aplicação inicia.
     */
    @Bean
    CommandLineRunner initStorage(StorageService storageService) {
        return (args) -> {
            storageService.init();
        };
    }
}