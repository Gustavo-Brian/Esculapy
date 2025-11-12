package ucb.app.esculapy.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para ser usada quando uma requisição não pode ser completada
 * devido a um conflito com o estado atual do recurso
 * (ex: email duplicado, estoque insuficiente, estado inválido).
 * Retorna automaticamente um HTTP 409 Conflict.
 */
@ResponseStatus(HttpStatus.CONFLICT) // 409
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}