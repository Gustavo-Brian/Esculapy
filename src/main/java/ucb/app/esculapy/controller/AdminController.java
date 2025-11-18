package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // --- Gerenciamento de Farmácias ---

    @GetMapping("/farmacias")
    public ApiResponse<Page<Farmacia>> getFarmaciasPorStatus(@RequestParam String status, Pageable pageable) {
        Page<Farmacia> farmacias = adminService.findFarmaciasByStatus(status, pageable);
        return ApiResponse.success(farmacias);
    }

    @PostMapping("/farmacias/{id}/aprovar")
    public ApiResponse<Farmacia> aprovarFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.aprovarFarmacia(id);
        return ApiResponse.success(farmacia);
    }

    @PostMapping("/farmacias/{id}/suspender")
    public ApiResponse<Farmacia> suspenderFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.suspenderFarmacia(id);
        return ApiResponse.success(farmacia);
    }

    @PostMapping("/farmacias/{id}/reativar")
    public ApiResponse<Farmacia> reativarFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.reativarFarmacia(id);
        return ApiResponse.success(farmacia);
    }

    // --- Gerenciamento de Usuários ---

    @GetMapping("/usuarios/buscar")
    public ApiResponse<Usuario> getUsuarioPorEmail(@RequestParam String email) {
        Usuario usuario = adminService.findUsuarioByEmail(email);
        return ApiResponse.success(usuario);
    }

    @PostMapping("/usuarios/{id}/desativar")
    public ApiResponse<Usuario> desativarUsuario(@PathVariable Long id) {
        Usuario usuario = adminService.setUsuarioEnabled(id, false);
        return ApiResponse.success(usuario);
    }

    @PostMapping("/usuarios/{id}/reativar")
    public ApiResponse<Usuario> reativarUsuario(@PathVariable Long id) {
        Usuario usuario = adminService.setUsuarioEnabled(id, true);
        return ApiResponse.success(usuario);
    }
}