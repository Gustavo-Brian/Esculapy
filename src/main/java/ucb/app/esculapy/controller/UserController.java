package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.*;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Farmaceutico;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // ========================================================================
    // --- Classes Internas (DTOs de Resposta Específicos para /me) ---
    // ========================================================================

    @Data
    private static class MeResponse {
        private Long id;
        private String email;
        private List<String> roles;
        private ClienteProfile cliente;
        private FarmaciaAdminProfile farmaciaAdmin;
        private FarmaceuticoProfile farmaceutico;

        public MeResponse(Usuario usuario) {
            this.id = usuario.getId();
            this.email = usuario.getEmail();
            this.roles = usuario.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            if (usuario.getCliente() != null) {
                this.cliente = new ClienteProfile(usuario.getCliente());
            }
            if (usuario.getFarmaciaAdmin() != null) {
                this.farmaciaAdmin = new FarmaciaAdminProfile(usuario.getFarmaciaAdmin());
            }
            if (usuario.getFarmaceutico() != null) {
                this.farmaceutico = new FarmaceuticoProfile(usuario.getFarmaceutico());
            }
        }
    }

    @Data
    private static class ClienteProfile {
        private Long id;
        private String nome;
        private String cpf;
        public ClienteProfile(Cliente c) {
            this.id = c.getId();
            this.nome = c.getNome();
            this.cpf = c.getCpf();
        }
    }

    @Data
    private static class FarmaciaAdminProfile {
        private Long id;
        private String nomeFantasia;
        private String cnpj;
        private String status;
        public FarmaciaAdminProfile(Farmacia f) {
            this.id = f.getId();
            this.nomeFantasia = f.getNomeFantasia();
            this.cnpj = f.getCnpj();
            this.status = f.getStatus().name();
        }
    }

    @Data
    private static class FarmaceuticoProfile {
        private Long id;
        private String nome;
        private String crfP;
        private Long farmaciaId;
        public FarmaceuticoProfile(Farmaceutico f) {
            this.id = f.getId();
            this.nome = f.getNome();
            this.crfP = f.getCrfP();
            this.farmaciaId = f.getFarmacia().getId();
        }
    }


    // ========================================================================
    // --- Endpoints ---
    // ========================================================================

    /**
     * Retorna as informações do usuário logado e seus perfis associados.
     */
    @GetMapping("/me")
    public ApiResponse<MeResponse> getMyInfo() {
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        MeResponse meResponse = new MeResponse(usuario);
        return ApiResponse.success(meResponse);
    }

    /**
     * Retorna o perfil editável do usuário (atualmente focado no Cliente).
     */
    @GetMapping("/profile")
    public ApiResponse<ProfileResponse> getProfile() {
        return ApiResponse.success(userService.getMeuProfile());
    }

    /**
     * Atualiza os dados do perfil do usuário (Nome, Telefone).
     */
    @PutMapping("/profile")
    public ApiResponse<ProfileResponse> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.success(userService.updateMeuProfile(request));
    }

    /**
     * Atualiza a senha do usuário logado.
     */
    @PutMapping("/password")
    public ApiResponse<Object> updatePassword(@Valid @RequestBody PasswordUpdateRequest request) {
        userService.updateMinhaSenha(request);
        return ApiResponse.success("Senha alterada com sucesso");
    }
}