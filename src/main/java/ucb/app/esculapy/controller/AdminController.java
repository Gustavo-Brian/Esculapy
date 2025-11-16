package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.service.AdminService;

import java.util.List;

/**
 * Controller para o Administrador Master da plataforma.
 * Gerencia Farmácias, Usuários e a saúde geral do sistema.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // --- Gerenciamento de Farmácias (REFATORADO) ---

    /**
     * (ADMIN) Lista farmácias por status (PENDENTE_APROVACAO, ATIVO, SUSPENSO)
     */
    @GetMapping("/farmacias")
    public ResponseEntity<List<Farmacia>> getFarmaciasPorStatus(@RequestParam String status) {
        List<Farmacia> farmacias = adminService.findFarmaciasByStatus(status);
        return ResponseEntity.ok(farmacias);
    }

    /**
     * (ADMIN) Aprova uma nova farmácia.
     * Muda o status de PENDENTE_APROVACAO para ATIVO.
     */
    @PostMapping("/farmacias/{id}/aprovar")
    public ResponseEntity<Farmacia> aprovarFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.aprovarFarmacia(id);
        return ResponseEntity.ok(farmacia);
    }

    /**
     * (ADMIN) Suspende uma farmácia ativa.
     * Muda o status de ATIVO para SUSPENSO.
     */
    @PostMapping("/farmacias/{id}/suspender")
    public ResponseEntity<Farmacia> suspenderFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.suspenderFarmacia(id);
        return ResponseEntity.ok(farmacia);
    }

    /**
     * (ADMIN) Reativa uma farmácia suspensa.
     * Muda o status de SUSPENSO para ATIVO.
     */
    @PostMapping("/farmacias/{id}/reativar")
    public ResponseEntity<Farmacia> reativarFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.reativarFarmacia(id);
        return ResponseEntity.ok(farmacia);
    }


    // --- Gerenciamento de Usuários (Sem alteração) ---

    /**
     * (ADMIN) Busca um usuário por e-mail.
     */
    @GetMapping("/usuarios/buscar")
    public ResponseEntity<Usuario> getUsuarioPorEmail(@RequestParam String email) {
        Usuario usuario = adminService.findUsuarioByEmail(email);
        return ResponseEntity.ok(usuario);
    }

    /**
     * (ADMIN) Desativa (bane) a conta de um usuário.
     */
    @PostMapping("/usuarios/{id}/desativar")
    public ResponseEntity<Usuario> desativarUsuario(@PathVariable Long id) {
        Usuario usuario = adminService.setUsuarioEnabled(id, false);
        return ResponseEntity.ok(usuario);
    }

    /**
     * (ADMIN) Reativa a conta de um usuário.
     */
    @PostMapping("/usuarios/{id}/reativar")
    public ResponseEntity<Usuario> reativarUsuario(@PathVariable Long id) {
        Usuario usuario = adminService.setUsuarioEnabled(id, true);
        return ResponseEntity.ok(usuario);
    }
}