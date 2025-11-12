package ucb.app.esculapy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para ser usada quando um recurso (ex: Pedido, Receita) não é encontrado.
 * Retorna automaticamente um HTTP 404 Not Found.
 */
@ResponseStatus(HttpStatus.NOT_FOUND) // 404
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}