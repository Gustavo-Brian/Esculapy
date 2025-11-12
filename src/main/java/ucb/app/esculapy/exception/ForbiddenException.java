package ucb.app.esculapy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para ser usada quando um usuário tenta fazer algo que não tem permissão
 * (ex: editar um recurso de outro usuário).
 * Retorna automaticamente um HTTP 403 Forbidden.
 */
@ResponseStatus(HttpStatus.FORBIDDEN) // 403
public class ForbiddenException extends RuntimeException {
    public ForbiddenException(String message) {
        super(message);
    }
}