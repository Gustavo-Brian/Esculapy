package ucb.app.esculapy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para ser usada quando uma requisição não pode ser completada
 * devido a um conflito com o estado atual do recurso.
 * Retorna HTTP 409 Conflict.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class ConflictException extends RuntimeException {
    /**
     * Cria uma nova exceção com uma mensagem detalhada.
     *
     * @param message A mensagem de erro.
     */
    public ConflictException(String message) {
        super(message);
    }
}