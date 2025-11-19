package ucb.app.esculapy.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

/**
 * Configuração do Cross-Origin Resource Sharing (CORS) para a aplicação Spring Boot.
 * Permite que clientes de diferentes domínios (frontend web e mobile) acessem a API.
 */
@Configuration
public class CorsConfig {

    /**
     * Define as políticas de CORS para a aplicação.
     *
     * @return Uma instância de {@link CorsConfigurationSource} com as regras de CORS configuradas.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Origens permitidas (URLs do frontend).
        // Em produção, esta lista deve ser restrita a URLs específicas por segurança.
        configuration.setAllowedOriginPatterns(Arrays.asList(
                "http://localhost:*",
                "http://127.0.0.1:*",
                "exp://*",
                "http://192.168.*.*:*"
        ));

        // Métodos HTTP permitidos
        configuration.setAllowedMethods(Arrays.asList(
                "GET",
                "POST",
                "PUT",
                "PATCH",
                "DELETE",
                "OPTIONS"
        ));

        // Cabeçalhos que a requisição pode conter
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "X-Requested-With",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));

        // Cabeçalhos que o navegador pode expor para o frontend
        configuration.setExposedHeaders(Arrays.asList(
                "Authorization",
                "Access-Control-Allow-Origin",
                "Access-Control-Allow-Credentials"
        ));

        // Permitir credenciais (ex: headers de autenticação JWT)
        configuration.setAllowCredentials(true);

        // Tempo de cache da configuração CORS (em segundos)
        configuration.setMaxAge(3600L);

        // Aplicar configuração a todas as rotas ("/**")
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}