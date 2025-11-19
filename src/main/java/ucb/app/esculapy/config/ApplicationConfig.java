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

/**
 * Classe de configuração principal para beans da aplicação, incluindo segurança e inicialização.
 */
@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UsuarioRepository usuarioRepository;

    /**
     * Define como o Spring Security deve carregar um usuário.
     *
     * @return Uma implementação de {@link UserDetailsService} que busca o usuário por e-mail.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com o e-mail: " + username));
    }

    /**
     * Define o provedor de autenticação usado pelo Spring Security.
     *
     * @return Uma instância de {@link AuthenticationProvider} configurada com o {@code userDetailsService} e o {@code passwordEncoder}.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Expõe o {@link AuthenticationManager} como um Bean para ser usado no processo de autenticação (login).
     *
     * @param config A configuração de autenticação do Spring.
     * @return O {@link AuthenticationManager}.
     * @throws Exception Se ocorrer um erro ao obter o AuthenticationManager.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Define o algoritmo de criptografia de senhas (BCrypt).
     *
     * @return Uma instância de {@link PasswordEncoder}.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Inicializa o serviço de storage (cria a pasta 'uploads' se necessário)
     * quando a aplicação inicia.
     *
     * @param storageService O serviço de storage a ser inicializado.
     * @return Uma implementação de {@link CommandLineRunner} que executa a inicialização.
     */
    @Bean
    CommandLineRunner initStorage(StorageService storageService) {
        return (args) -> {
            storageService.init();
        };
    }
}