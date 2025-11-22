package ucb.app.esculapy.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ucb.app.esculapy.dto.ErrorResponse;

import java.util.stream.Collectors;

/**
 * Componente que trata globalmente as exceções lançadas pelos controladores REST,
 * formatando a resposta para o formato {@link ErrorResponse}.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Trata a exceção {@link ResourceNotFoundException}, retornando HTTP 404.
     *
     * @param ex A exceção lançada.
     * @param request A requisição HTTP.
     * @return Uma resposta HTTP 404 com o corpo {@link ErrorResponse}.
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.NOT_FOUND.value(),
                "Not Found",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Trata a exceção {@link ConflictException}, retornando HTTP 409.
     *
     * @param ex A exceção lançada.
     * @param request A requisição HTTP.
     * @return Uma resposta HTTP 409 com o corpo {@link ErrorResponse}.
     */
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorResponse> handleConflict(ConflictException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.CONFLICT.value(),
                "Conflict",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.CONFLICT);
    }

    /**
     * Trata a exceção {@link ForbiddenException}, retornando HTTP 403.
     *
     * @param ex A exceção lançada.
     * @param request A requisição HTTP.
     * @return Uma resposta HTTP 403 com o corpo {@link ErrorResponse}.
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException ex, HttpServletRequest request) {
        ErrorResponse error = new ErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "Forbidden",
                ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    /**
     * Captura erros de validação (@Valid) dos DTOs, retornando HTTP 400.
     * Junta todas as mensagens de erro em uma única string para o cliente.
     *
     * @param ex A exceção {@link MethodArgumentNotValidException} lançada pelo Spring.
     * @param request A requisição HTTP.
     * @return Uma resposta HTTP 400 com o corpo {@link ErrorResponse}.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String mensagem = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ErrorResponse error = new ErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "Bad Request",
                mensagem,
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Captura qualquer outra exceção não tratada, retornando HTTP 500.
     *
     * @param ex A exceção genérica.
     * @param request A requisição HTTP.
     * @return Uma resposta HTTP 500 com o corpo {@link ErrorResponse}.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        ex.printStackTrace();

        ErrorResponse error = new ErrorResponse(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Internal Server Error",
                "Ocorreu um erro inesperado: " + ex.getMessage(),
                request.getRequestURI()
        );
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}