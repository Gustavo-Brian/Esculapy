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

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(authz -> authz
                        // --- ROTAS PÚBLICAS ---

                        // Autenticação
                        .requestMatchers("/api/auth/**").permitAll()

                        // Catálogo e Estoque (Visualização)
                        .requestMatchers(HttpMethod.GET, "/api/catalogo/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/estoque/**").permitAll()

                        // Farmácias (Listagem pública)
                        .requestMatchers(HttpMethod.GET, "/api/farmacias/**").permitAll()

                        // Webhooks (Pagamento, etc)
                        .requestMatchers("/api/webhooks/**").permitAll()

                        // Tratamento de Erros e Swagger (se houver)
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**").permitAll()

                        // --- ROTAS PROTEGIDAS ---
                        // Qualquer outra requisição exige autenticação
                        .anyRequest().authenticated()
                )

                // --- CONFIGURAÇÃO DE SESSÃO ---
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // --- FILTROS ---
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}