package ucb.app.esculapy.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import ucb.app.esculapy.security.jwt.JwtAuthenticationFilter;

/**
 * Classe de configuração principal para o Spring Security.
 * Define as políticas de acesso, o gerenciamento de sessão, a integração do filtro JWT
 * e habilita o CORS usando o {@link ucb.app.esculapy.config.CorsConfig}.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Define a cadeia de filtros de segurança que será aplicada a todas as requisições.
     *
     * @param http O objeto HttpSecurity para configuração.
     * @return A cadeia de filtros configurada.
     * @throws Exception Se ocorrer um erro de configuração.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Desabilita a proteção CSRF, pois estamos usando autenticação baseada em token (JWT)
                .csrf(csrf -> csrf.disable())

                // Habilita a configuração CORS definida separadamente (em CorsConfig)
                .cors(cors -> {})

                .authorizeHttpRequests(authz -> authz
                        // --- ROTAS PÚBLICAS ---

                        // Autenticação (Login, Registro, Recuperação de Senha)
                        .requestMatchers("/api/auth/**").permitAll()

                        // Catálogo, Estoque e Farmácias (Visualização pública)
                        .requestMatchers(HttpMethod.GET, "/api/catalogo/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/estoque/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/farmacias/**").permitAll()

                        // Webhooks (Comunicação com Gateway de Pagamento, etc.)
                        .requestMatchers("/api/webhooks/**").permitAll()

                        // Tratamento de Erros e Documentação (Swagger/OpenAPI)
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()

                        // --- ROTAS PROTEGIDAS ---
                        // Qualquer outra requisição exige autenticação (deve ter um token JWT válido)
                        .anyRequest().authenticated()
                )

                // --- CONFIGURAÇÃO DE SESSÃO ---
                // Define a política como STATELESS, essencial para autenticação baseada em token
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // --- FILTROS ---
                // Define o provedor de autenticação personalizado
                .authenticationProvider(authenticationProvider)
                // Adiciona o filtro JWT antes do filtro padrão de autenticação do Spring
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}