package ucb.app.esculapy.controller;

import ucb.app.esculapy.dto.*;
import ucb.app.esculapy.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ApiResponse.success(authResponse);
    }

    @PostMapping("/register/cliente")
    public ApiResponse<AuthResponse> registerCliente(@Valid @RequestBody RegisterClienteRequest request) {
        AuthResponse authResponse = authService.registerCliente(request);
        return ApiResponse.success(authResponse);
    }

    @PostMapping("/register/farmacia")
    public ApiResponse<AuthResponse> registerFarmacia(@Valid @RequestBody RegisterFarmaciaRequest request) {
        AuthResponse authResponse = authService.registerFarmacia(request);
        return ApiResponse.success(authResponse);
    }

    // --- ENDPOINTS ADICIONADOS (da lista) ---

    @PostMapping("/forgot-password")
    public ApiResponse<Object> forgotPassword(@Valid @RequestBody PasswordForgotRequest request) {
        authService.forgotPassword(request.getEmail());
        return ApiResponse.success("Se um e-mail válido foi informado, um link de recuperação foi enviado.");
    }

    @PostMapping("/reset-password")
    public ApiResponse<Object> resetPassword(@Valid @RequestBody PasswordResetRequest request) {
        authService.resetPassword(request.getToken(), request.getNovaSenha());
        return ApiResponse.success("Senha redefinida com sucesso.");
    }
}