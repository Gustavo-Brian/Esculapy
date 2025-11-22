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

/**
 * Controlador REST para operações administrativas.
 * Acesso restrito a usuários com a role 'ADMIN'.
 * Gerencia a aprovação/suspensão de farmácias e o status de usuários.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * Obtém uma lista paginada de farmácias com base no status (ex: PENDENTE, ATIVA, SUSPENSA).
     *
     * @param status O status da farmácia a ser filtrado.
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link Farmacia}.
     */
    @GetMapping("/farmacias")
    public ApiResponse<Page<Farmacia>> getFarmaciasPorStatus(@RequestParam String status, Pageable pageable) {
        Page<Farmacia> farmacias = adminService.findFarmaciasByStatus(status, pageable);
        return ApiResponse.success(farmacias);
    }

    /**
     * Aprova o cadastro de uma farmácia.
     *
     * @param id O ID da farmácia a ser aprovada.
     * @return Uma resposta de API contendo a {@link Farmacia} atualizada.
     */
    @PostMapping("/farmacias/{id}/aprovar")
    public ApiResponse<Farmacia> aprovarFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.aprovarFarmacia(id);
        return ApiResponse.success(farmacia);
    }

    /**
     * Suspende as atividades de uma farmácia.
     *
     * @param id O ID da farmácia a ser suspensa.
     * @return Uma resposta de API contendo a {@link Farmacia} atualizada.
     */
    @PostMapping("/farmacias/{id}/suspender")
    public ApiResponse<Farmacia> suspenderFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.suspenderFarmacia(id);
        return ApiResponse.success(farmacia);
    }

    /**
     * Reativa uma farmácia que estava suspensa.
     *
     * @param id O ID da farmácia a ser reativada.
     * @return Uma resposta de API contendo a {@link Farmacia} atualizada.
     */
    @PostMapping("/farmacias/{id}/reativar")
    public ApiResponse<Farmacia> reativarFarmacia(@PathVariable Long id) {
        Farmacia farmacia = adminService.reativarFarmacia(id);
        return ApiResponse.success(farmacia);
    }

    /**
     * Busca um usuário pelo seu endereço de e-mail.
     *
     * @param email O e-mail do usuário a ser buscado.
     * @return Uma resposta de API contendo o objeto {@link Usuario}.
     */
    @GetMapping("/usuarios/buscar")
    public ApiResponse<Usuario> getUsuarioPorEmail(@RequestParam String email) {
        Usuario usuario = adminService.findUsuarioByEmail(email);
        return ApiResponse.success(usuario);
    }

    /**
     * Desativa a conta de um usuário.
     *
     * @param id O ID do usuário a ser desativado.
     * @return Uma resposta de API contendo o objeto {@link Usuario} atualizado.
     */
    @PostMapping("/usuarios/{id}/desativar")
    public ApiResponse<Usuario> desativarUsuario(@PathVariable Long id) {
        Usuario usuario = adminService.setUsuarioEnabled(id, false);
        return ApiResponse.success(usuario);
    }

    /**
     * Reativa a conta de um usuário desativado.
     *
     * @param id O ID do usuário a ser reativado.
     * @return Uma resposta de API contendo o objeto {@link Usuario} atualizado.
     */
    @PostMapping("/usuarios/{id}/reativar")
    public ApiResponse<Usuario> reativarUsuario(@PathVariable Long id) {
        Usuario usuario = adminService.setUsuarioEnabled(id, true);
        return ApiResponse.success(usuario);
    }
}