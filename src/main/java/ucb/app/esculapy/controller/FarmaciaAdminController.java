package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.EstoqueRequest;
import ucb.app.esculapy.dto.PedidoStatusUpdateRequest;
import ucb.app.esculapy.dto.RegisterFarmaceuticoRequest;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.model.Farmaceutico;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.service.EstoqueService;
import ucb.app.esculapy.service.FarmaciaService;
import ucb.app.esculapy.service.PedidoManagementService;

import java.util.List;

/**
 * Controller unificado para o Dono da Farmácia (LOJISTA_ADMIN).
 * Gerencia Estoque, Funcionários e Pedidos.
 */
@RestController
@RequestMapping("/api/farmacia-admin")
@PreAuthorize("hasRole('ROLE_LOJISTA_ADMIN')")
@RequiredArgsConstructor
public class FarmaciaAdminController {

    private final FarmaciaService farmaciaService;
    private final EstoqueService estoqueService;
    private final PedidoManagementService pedidoManagementService;

    // --- Gerenciamento de Funcionários (do FarmaciaManagementController) ---

    @PostMapping("/farmaceuticos")
    public ResponseEntity<Farmaceutico> adicionarFarmaceutico(@Valid @RequestBody RegisterFarmaceuticoRequest request) {
        Farmaceutico novoFarmaceutico = farmaciaService.adicionarFarmaceutico(request);
        return ResponseEntity.ok(novoFarmaceutico);
    }

    // --- Gerenciamento de Estoque (do FarmaciaManagementController) ---

    @PostMapping("/estoque")
    public ResponseEntity<EstoqueLojista> adicionarItemEstoque(@Valid @RequestBody EstoqueRequest request) {
        EstoqueLojista novoItem = estoqueService.adicionarItemEstoque(request);
        return ResponseEntity.ok(novoItem);
    }

    @PutMapping("/estoque/{estoqueId}")
    public ResponseEntity<EstoqueLojista> atualizarEstoque(
            @PathVariable Long estoqueId,
            @Valid @RequestBody EstoqueRequest request) {

        EstoqueLojista itemAtualizado = estoqueService.updateEstoque(estoqueId, request);
        return ResponseEntity.ok(itemAtualizado);
    }

    @DeleteMapping("/estoque/{estoqueId}")
    public ResponseEntity<Void> deletarEstoque(@PathVariable Long estoqueId) {
        estoqueService.deleteEstoque(estoqueId);
        return ResponseEntity.noContent().build();
    }

    /**
     * NOVO ENDPOINT (Seu Pedido)
     * Lista todos os itens de estoque da farmácia logada.
     */
    @GetMapping("/estoque")
    public ResponseEntity<List<EstoqueLojista>> getEstoqueDaFarmacia() {
        List<EstoqueLojista> estoque = estoqueService.getEstoqueDaFarmacia();
        return ResponseEntity.ok(estoque);
    }

    // --- Gerenciamento de Pedidos (do FarmaciaAdminController) ---

    @GetMapping("/pedidos")
    public ResponseEntity<List<Pedido>> getPedidosDaFarmacia() {
        List<Pedido> pedidos = pedidoManagementService.getPedidosFarmacia();
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/pedidos/{pedidoId}/status")
    public ResponseEntity<Pedido> atualizarStatusPedido(
            @PathVariable Long pedidoId,
            @Valid @RequestBody PedidoStatusUpdateRequest request) {

        Pedido pedidoAtualizado = pedidoManagementService.updateStatus(pedidoId, request);
        return ResponseEntity.ok(pedidoAtualizado);
    }
}