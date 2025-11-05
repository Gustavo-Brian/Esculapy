package ucb.app.esculapy.security;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Properties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;

@SuppressWarnings("unused")
public class InteractiveConfigInitializer implements EnvironmentPostProcessor {

    private static final String PROPERTY_SOURCE_NAME = "interactiveConfig";

    // Função auxiliar para ler a entrada e tratar erros/vazio
    private String readInput(BufferedReader reader, String prompt, String defaultValue) throws Exception {
        System.out.print("  > " + prompt + " (Padrão: " + (defaultValue.isEmpty() ? "Vazio" : defaultValue) + "): ");
        String input = reader.readLine();
        return (input == null || input.trim().isEmpty()) ? defaultValue : input.trim();
    }

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {

            // --- TELA DE PROMPT MELHORADA ---
            System.out.println("\n=========================================================================");
            System.out.println("         🚀 CONFIGURAÇÃO DE AMBIENTE INTERATIVA (ESCULAPY API)");
            System.out.println("=========================================================================");
            System.out.println("                  Pressione ENTER para usar o padrão.");
            System.out.println("\n");

            Properties props = new Properties();

            // --- 1. CONFIGURAÇÃO DO SERVIDOR (HOST/PORT) ---
            System.out.println("  [HOST/PORT] Configuração do Servidor:");

            // NOVO CAMPO: SERVER HOST/IP
            String defaultServerHost = environment.getProperty("server.address", "127.0.0.1");
            String serverHost = readInput(reader, "1/6] Host IP (Ex: 0.0.0.0 ou 127.0.0.1)", defaultServerHost);
            props.setProperty("server.address", serverHost);

            // SERVER PORT
            String defaultServerPort = environment.getProperty("server.port", "8080");
            String serverPort = readInput(reader, "2/6] Porta do Servidor", defaultServerPort);
            props.setProperty("server.port", serverPort);

            System.out.println("\n  [DATABASE] Credenciais de Conexão:");

            // --- 2. DATABASE URL ---
            String defaultDbUrl = environment.getProperty("spring.datasource.url", "jdbc:mysql://localhost:3306/farmacia_db?createDatabaseIfNotExist=true&useSSL=false");
            String dbUrl = readInput(reader, "3/6] URL do Banco de Dados", defaultDbUrl);
            props.setProperty("spring.datasource.url", dbUrl);

            // --- 3. DATABASE USER ---
            String defaultDbUsername = environment.getProperty("spring.datasource.username", "root");
            String dbUsername = readInput(reader, "4/6] Usuário do Banco de Dados", defaultDbUsername);
            props.setProperty("spring.datasource.username", dbUsername);

            // --- 4. DATABASE PASSWORD ---
            String dbPassword = readInput(reader, "5/6] Senha do Banco de Dados", ""); // Senha não deve ter padrão visível
            props.setProperty("spring.datasource.password", dbPassword);

            // --- 5. JWT SECRET ---
            String defaultJwtSecret = environment.getProperty("jwt.secret", "chave-secreta-para-testes-seguranca-32-bits");
            String jwtSecret = readInput(reader, "6/6] Chave JWT", defaultJwtSecret);
            props.setProperty("jwt.secret", jwtSecret);


            // Injeta as propriedades no ambiente do Spring
            environment.getPropertySources().addFirst(new PropertiesPropertySource(PROPERTY_SOURCE_NAME, props));

            System.out.println("\n-----------------------------------------------------------");
            System.out.println(" ✅ CONFIGURAÇÃO CONCLUÍDA. INICIANDO SERVIDOR...");
            System.out.println("-----------------------------------------------------------\n");

        } catch (Exception e) {
            // Se houver qualquer erro inesperado ou leitura falhar (ex: terminal fechado)
            System.err.println("\n❌ ERRO FATAL NA LEITURA INTERATIVA. Iniciando com application.properties. Erro: " + e.getMessage());
            // O Spring continuará com o application.properties
        }
    }
}