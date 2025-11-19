package ucb.app.esculapy.dto;

import lombok.Data;

/**
 * DTO de resposta padrão para todas as chamadas de API, encapsulando o resultado.
 *
 * @param <T> O tipo de dados contidos no corpo da resposta.
 */
@Data
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    /**
     * Construtor privado para forçar o uso dos métodos estáticos
     * {@link #success(Object)} e {@link #success(String)}.
     *
     * @param success Indica se a operação foi bem-sucedida.
     * @param message Uma mensagem descritiva.
     * @param data O dado retornado pela operação.
     */
    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /**
     * Cria uma resposta de sucesso padrão (HTTP 200) com dados.
     *
     * @param data O dado a ser incluído na resposta.
     * @param <T> O tipo de dado.
     * @return Uma nova instância de {@link ApiResponse} de sucesso.
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Operação realizada com sucesso", data);
    }

    /**
     * Cria uma resposta de sucesso (ex: HTTP 201 Created) sem dados de retorno.
     *
     * @param message Uma mensagem descritiva de sucesso.
     * @param <T> O tipo de dado (geralmente Object, ou Void).
     * @return Uma nova instância de {@link ApiResponse} de sucesso.
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }
}