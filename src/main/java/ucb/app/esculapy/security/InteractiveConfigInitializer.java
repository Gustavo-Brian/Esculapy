package ucb.app.esculapy.security;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Properties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.PropertiesPropertySource;

/**
 * Implementação de {@link EnvironmentPostProcessor} para inicialização interativa de configurações.
 * Permite que o usuário insira configurações essenciais (porta, DB, JWT secret) via console na inicialização.
 */
public class InteractiveConfigInitializer implements EnvironmentPostProcessor {

    private static final String PROPERTY_SOURCE_NAME = "interactiveConfig";

    /**
     * Lê uma entrada do console com um valor padrão.
     *
     * @param reader O leitor de entrada.
     * @param prompt A mensagem de prompt.
     * @param defaultValue O valor padrão.
     * @return O valor lido ou o valor padrão.
     * @throws Exception Se ocorrer um erro de I/O.
     */
    private String readInput(BufferedReader reader, String prompt, String defaultValue) throws Exception {
        System.out.print("  " + prompt + " [" + defaultValue + "]: ");
        String input = reader.readLine();
        return (input == null || input.trim().isEmpty()) ? defaultValue : input.trim();
    }

    /**
     * Processa o ambiente de configuração antes da inicialização do Spring.
     *
     * @param environment O ambiente configurável.
     * @param application A aplicação Spring.
     */
    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {

        if (System.getProperty("java.class.path").contains("junit")) {
            return;
        }

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(System.in))) {

            System.out.println("\n=======================================================");
            System.out.println(" 🛠️ CONFIGURAÇÃO INTERATIVA DE EXECUÇÃO 🛠️");
            System.out.println("=======================================================");

            Properties props = new Properties();

            String serverPort = readInput(reader, "[1/6] Porta do Servidor", "8080");
            props.setProperty("server.port", serverPort);

            String defaultDbUrl = environment.getProperty(
                    "spring.datasource.url",
                    "jdbc:mysql://localhost:3306/esculapy?allowPublicKeyRetrieval=true&useSSL=false"
            );
            String dbUrl = readInput(reader, "[2/6] URL do Banco de Dados", defaultDbUrl);
            props.setProperty("spring.datasource.url", dbUrl);

            String dbUsername = readInput(reader, "[3/6] Usuário do Banco de Dados", "seu-user");
            props.setProperty("spring.datasource.username", dbUsername);

            String dbPassword = readInput(reader, "[4/6] Senha do Banco de Dados", "seu-password");
            props.setProperty("spring.datasource.password", dbPassword);

            String defaultJwtSecret = environment.getProperty("jwt.secret", "SUA_CHAVE_SECRETA_PADRAO_DE_TESTE_32_BITS");
            String jwtSecret = readInput(reader, "[5/6] Chave JWT", defaultJwtSecret);
            props.setProperty("jwt.secret", jwtSecret);

            String webhookSecret = readInput(reader, "[6/6] Webhook Secret", "SUA_CHAVE_SECRETA_DO_WEBHOOK");
            props.setProperty("pagamento.webhook.secret", webhookSecret);

            environment.getPropertySources().addFirst(new PropertiesPropertySource(PROPERTY_SOURCE_NAME, props));

            System.out.println("=======================================================");
            System.out.println(" ✅ Configurações salvas. Iniciando aplicação...");
            System.out.println("=======================================================\n");

        } catch (Exception e) {
            System.err.println("\n❌ ERRO NA LEITURA INTERATIVA. Usando configs padrão.");
        }
    }
}