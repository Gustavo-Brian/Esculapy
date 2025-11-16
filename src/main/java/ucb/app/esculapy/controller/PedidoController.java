package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.dto.CriarPedidoRequest;
import ucb.app.esculapy.dto.PagamentoResponse; // --- IMPORT ADICIONADO ---
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.service.PagamentoService; // --- IMPORT ADICIONADO ---
import ucb.app.esculapy.service.PedidoService;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@PreAuthorize("hasRole('CLIENTE')") // Só clientes compram
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;
    private final PagamentoService pagamentoService; // --- DEPENDÊNCIA ADICIONADA ---

    /**
     * Cria um novo pedido (fecha o carrinho).
     */
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(
            @Valid @RequestBody CriarPedidoRequest request
    ) {
        Pedido pedidoCriado = pedidoService.criarPedido(request);
        return ResponseEntity.ok(pedidoCriado);
    }

    // --- NOVO ENDPOINT ADICIONADO ---
    /**
     * Inicia o processo de pagamento para um pedido
     * que está aguardando pagamento.
     */
    @PostMapping("/{pedidoId}/pagar")
    public ResponseEntity<PagamentoResponse> pagarPedido(
            @PathVariable Long pedidoId
    ) {
        PagamentoResponse response = pagamentoService.criarSessaoDePagamento(pedidoId);
        return ResponseEntity.ok(response);
    }
    // --- FIM DO NOVO ENDPOINT ---

    /**
     * Faz o upload da foto/PDF da receita para um pedido que está pendente.
     */
    @PostMapping("/{pedidoId}/receita")
    public ResponseEntity<Pedido> uploadReceita(
            @PathVariable Long pedidoId,
            @RequestParam("arquivo") MultipartFile arquivo
    ) {
        Pedido pedido = pedidoService.anexarReceita(pedidoId, arquivo);
        return ResponseEntity.ok(pedido);
    }

    /**
     * Cliente busca seu histórico de pedidos.
     */
    @GetMapping("/meus-pedidos")
    public ResponseEntity<List<Pedido>> getMeusPedidos() {
        List<Pedido> pedidos = pedidoService.getMeusPedidos();
        return ResponseEntity.ok(pedidos);
    }
}