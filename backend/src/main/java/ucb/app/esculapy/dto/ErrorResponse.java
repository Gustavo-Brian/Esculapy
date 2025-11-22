package ucb.app.esculapy.dto;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * DTO de resposta padrão usado para formatar erros retornados pela API (tratamento global de exceções).
 */
@Data
public class ErrorResponse {

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;

    /**
     * Construtor para criar uma resposta de erro.
     *
     * @param status O código de status HTTP do erro.
     * @param error O tipo de erro (ex: "Bad Request", "Not Found").
     * @param message Uma mensagem detalhada do erro.
     * @param path O caminho da requisição que causou o erro.
     */
    public ErrorResponse(int status, String error, String message, String path) {
        this.timestamp = LocalDateTime.now();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }
}