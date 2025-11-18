package ucb.app.esculapy.dto;

import lombok.Data;

@Data
public class ApiResponse<T> {

    private boolean success;
    private String message;
    private T data;

    // Construtor privado para forçar o uso dos métodos estáticos
    private ApiResponse(boolean success, String message, T data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }

    /**
     * Cria uma resposta de sucesso padrão (HTTP 200) com dados.
     */
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "Operação realizada com sucesso", data);
    }

    /**
     * Cria uma resposta de sucesso (ex: HTTP 201 Created) sem dados de retorno.
     */
    public static <T> ApiResponse<T> success(String message) {
        return new ApiResponse<>(true, message, null);
    }
}