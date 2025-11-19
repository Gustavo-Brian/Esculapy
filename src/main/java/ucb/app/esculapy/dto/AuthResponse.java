package ucb.app.esculapy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO de resposta padrão para endpoints de autenticação (login/registro),
 * contendo o token de acesso e informações básicas do usuário.
 */
@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Long userId;
    private String email;
}