package ucb.app.esculapy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Ponto de entrada principal para a aplicação Esculapy.
 *
 * Esta classe inicializa e executa o Spring Boot, configurando o contexto
 * da aplicação.
 */
@SpringBootApplication
public class EsculapyApplication {

    /**
     * Método principal que inicializa e executa a aplicação Spring Boot.
     *
     * @param args Argumentos de linha de comando.
     */
    public static void main(String[] args) {
        SpringApplication.run(EsculapyApplication.class, args);
    }

}