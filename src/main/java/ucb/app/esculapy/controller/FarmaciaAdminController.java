package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.PedidoStatusUpdateRequest;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.service.PedidoManagementService;

import java.util.List;

@RestController
@RequestMapping("/api/farmacia-admin")
@PreAuthorize("hasRole('ROLE_LOJISTA_ADMIN')") // Só o Dono da Farmácia
@RequiredArgsConstructor
public class FarmaciaAdminController {

    private final PedidoManagementService pedidoManagementService;

    // Outros métodos (CRUD de Estoque/Farmaceutico) estariam em FarmaciaManagementController

    /**
     * GET /api/farmacia-admin/pedidos - Lista todos os pedidos pertencentes à Farmácia logada.
     */
    @GetMapping("/pedidos")
    public ResponseEntity<List<Pedido>> getPedidosDaFarmacia() {
        List<Pedido> pedidos = pedidoManagementService.getPedidosFarmacia();
        return ResponseEntity.ok(pedidos);
    }

    /**
     * PUT /api/farmacia-admin/pedidos/{pedidoId}/status - Atualiza o status do pedido (Em Separação, Enviado, etc.).
     */
    @PutMapping("/pedidos/{pedidoId}/status")
    public ResponseEntity<Pedido> atualizarStatusPedido(
            @PathVariable Long pedidoId,
            @Valid @RequestBody PedidoStatusUpdateRequest request) {

        Pedido pedidoAtualizado = pedidoManagementService.updateStatus(pedidoId, request);
        return ResponseEntity.ok(pedidoAtualizado);
    }
}