package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.dto.CarrinhoRequest;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.service.PedidoService;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@PreAuthorize("hasRole('CLIENTE')") // Só clientes compram
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    /**
     * Cria um novo pedido (fecha o carrinho).
     * O DTO do carrinho vem no RequestBody.
     */
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@Valid @RequestBody CarrinhoRequest carrinho) {
        Pedido pedidoCriado = pedidoService.criarPedido(carrinho);
        return ResponseEntity.ok(pedidoCriado);
    }

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