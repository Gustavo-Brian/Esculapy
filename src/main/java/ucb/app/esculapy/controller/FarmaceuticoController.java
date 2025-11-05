package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.dto.ValidacaoReceitaRequest;
import ucb.app.esculapy.model.Pedido; // <-- IMPORTAR
import ucb.app.esculapy.service.ReceitaService; // <-- IMPORTAR O SERVICE

import java.util.List; // <-- IMPORTAR

@RestController
@RequestMapping("/api/farmaceutico")
@PreAuthorize("hasRole('FARMACEUTICO')")
@RequiredArgsConstructor // <-- Lombok injeta o service
public class FarmaceuticoController {

    // O service é injetado via construtor
    private final ReceitaService receitaService;

    /**
     * Busca pedidos pendentes de validação farmacêutica
     * que sejam da farmácia deste farmacêutico logado.
     */
    @GetMapping("/pedidos/pendentes")
    public ResponseEntity<List<Pedido>> getPedidosPendentes() {
        // A lógica foi movida para o service
        List<Pedido> pedidos = receitaService.buscarPendentes();
        return ResponseEntity.ok(pedidos);
    }

    /**
     * Aprova uma receita de um pedido.
     */
    @PostMapping("/pedidos/{pedidoId}/receita/aprovar")
    public ResponseEntity<Pedido> aprovarReceita(@PathVariable Long pedidoId) {
        // A lógica foi movida para o service
        Pedido pedido = receitaService.aprovarReceita(pedidoId);
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
        // A lógica foi movida para o service
        Pedido pedido = receitaService.rejeitarReceita(pedidoId, request.getJustificativa());
        return ResponseEntity.ok(pedido);
    }
}