package ucb.app.esculapy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para ser usada quando um usuário tenta fazer algo que não tem permissão.
 * Retorna HTTP 403 Forbidden.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class ForbiddenException extends RuntimeException {
    /**
     * Cria uma nova exceção com uma mensagem detalhada.
     *
     * @param message A mensagem de erro.
     */
    public ForbiddenException(String message) {
        super(message);
    }
}