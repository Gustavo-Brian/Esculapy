package ucb.app.esculapy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para ser usada quando um recurso (ex: Pedido, Receita) não é encontrado.
 * Retorna HTTP 404 Not Found.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    /**
     * Cria uma nova exceção com uma mensagem detalhada.
     *
     * @param message A mensagem de erro.
     */
    public ResourceNotFoundException(String message) {
        super(message);
    }
}