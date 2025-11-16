package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*; // Importação atualizada
import ucb.app.esculapy.dto.ValidacaoReceitaRequest;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.service.PedidoService; // --- ALTERAÇÃO ---
// import ucb.app.esculapy.service.ReceitaService; // --- DELETADO ---

import java.util.List;

@RestController
@RequestMapping("/api/farmaceutico")
@PreAuthorize("hasRole('FARMACEUTICO')")
@RequiredArgsConstructor
public class FarmaceuticoController {

    private final PedidoService pedidoService; // --- ALTERAÇÃO ---

    /**
     * Busca pedidos pendentes de validação farmacêutica
     * que sejam da farmácia deste farmacêutico logado.
     */
    @GetMapping("/pedidos/pendentes")
    public ResponseEntity<List<Pedido>> getPedidosPendentes() {
        List<Pedido> pedidos = pedidoService.getPedidosPendentesFarmaceutico(); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(pedidos);
    }

    /**
     * Aprova uma receita de um pedido.
     */
    @PostMapping("/pedidos/{pedidoId}/receita/aprovar")
    public ResponseEntity<Pedido> aprovarReceita(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.aprovarReceita(pedidoId); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(pedido);
    }

    /**
     * Rejeita uma receita de um pedido.
     */
    @PostMapping("/pedidos/{pedidoId}/receita/rejeitar")
    public ResponseEntity<Pedido> rejeitarReceita(
            @PathVariable Long pedidoId,
            @Valid @RequestBody ValidacaoReceitaRequest request
    ) {
        Pedido pedido = pedidoService.rejeitarReceita(pedidoId, request.getJustificativa()); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(pedido);
    }
}