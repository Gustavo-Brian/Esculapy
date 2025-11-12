package ucb.app.esculapy.controller;

import ucb.app.esculapy.dto.AuthResponse;
import ucb.app.esculapy.dto.LoginRequest;
import ucb.app.esculapy.dto.RegisterClienteRequest;
import ucb.app.esculapy.dto.RegisterFarmaciaRequest;
import ucb.app.esculapy.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register/cliente")
    public ResponseEntity<AuthResponse> registerCliente(@Valid @RequestBody RegisterClienteRequest request) {
        AuthResponse authResponse = authService.registerCliente(request);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register/farmacia")
    public ResponseEntity<AuthResponse> registerFarmacia(@Valid @RequestBody RegisterFarmaciaRequest request) {
        AuthResponse authResponse = authService.registerFarmacia(request);
        return ResponseEntity.ok(authResponse);
    }
}