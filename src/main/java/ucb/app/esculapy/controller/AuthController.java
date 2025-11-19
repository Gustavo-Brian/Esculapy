package ucb.app.esculapy.controller;

import ucb.app.esculapy.dto.*;
import ucb.app.esculapy.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador REST para operações de autenticação e registro.
 * Inclui endpoints para login, registro de cliente/farmácia e redefinição de senha.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    /**
     * Realiza a autenticação (login) de um usuário.
     *
     * @param loginRequest O DTO contendo as credenciais de login (e-mail e senha).
     * @return Uma resposta de API contendo o {@link AuthResponse} com o token de autenticação.
     */
    @PostMapping("/login")
    public ApiResponse<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ApiResponse.success(authResponse);
    }

    /**
     * Realiza o registro de um novo cliente.
     *
     * @param request O DTO contendo os dados de registro do cliente.
     * @return Uma resposta de API contendo o {@link AuthResponse} com o token de autenticação do novo cliente.
     */
    @PostMapping("/register/cliente")
    public ApiResponse<AuthResponse> registerCliente(@Valid @RequestBody RegisterClienteRequest request) {
        AuthResponse authResponse = authService.registerCliente(request);
        return ApiResponse.success(authResponse);
    }

    /**
     * Realiza o registro de uma nova farmácia e seu administrador (lojista).
     *
     * @param request O DTO contendo os dados de registro da farmácia e do administrador.
     * @return Uma resposta de API contendo o {@link AuthResponse} com o token de autenticação do administrador.
     */
    @PostMapping("/register/farmacia")
    public ApiResponse<AuthResponse> registerFarmacia(@Valid @RequestBody RegisterFarmaciaRequest request) {
        AuthResponse authResponse = authService.registerFarmacia(request);
        return ApiResponse.success(authResponse);
    }

    /**
     * Inicia o processo de recuperação de senha, enviando um link/token para o e-mail do usuário.
     *
     * @param request O DTO contendo o e-mail do usuário que esqueceu a senha.
     * @return Uma resposta de API de sucesso, informando que o link de recuperação foi enviado se o e-mail for válido.
     */
    @PostMapping("/forgot-password")
    public ApiResponse<Object> forgotPassword(@Valid @RequestBody PasswordForgotRequest request) {
        authService.forgotPassword(request.getEmail());
        return ApiResponse.success("Se um e-mail válido foi informado, um link de recuperação foi enviado.");
    }

    /**
     * Redefine a senha do usuário usando um token de recuperação.
     *
     * @param request O DTO contendo o token de recuperação e a nova senha.
     * @return Uma resposta de API de sucesso.
     */
    @PostMapping("/reset-password")
    public ApiResponse<Object> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        authService.resetPassword(request.getToken(), request.getNovaSenha());
        return ApiResponse.success("Senha redefinida com sucesso.");
    }
}