package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.dto.CarrinhoRequest; // <-- IMPORTAR
import ucb.app.esculapy.model.Pedido; // <-- IMPORTAR
import ucb.app.esculapy.service.PedidoService; // <-- IMPORTAR

import java.util.List; // <-- IMPORTAR

@RestController
@RequestMapping("/api/pedidos")
@PreAuthorize("hasRole('CLIENTE')") // Só clientes compram
@RequiredArgsConstructor // Injeta os services
public class PedidoController {

    // Injeção via construtor
    private final PedidoService pedidoService;
    // O StorageService é usado *dentro* do PedidoService, não precisa aqui.

    /**
     * Cria um novo pedido (fecha o carrinho).
     * O DTO do carrinho vem no RequestBody.
     */
    @PostMapping
    public ResponseEntity<Pedido> criarPedido(@Valid @RequestBody CarrinhoRequest carrinho) {
        // A lógica foi movida para o service
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
        // A lógica foi movida para o service
        Pedido pedido = pedidoService.anexarReceita(pedidoId, arquivo);
        return ResponseEntity.ok(pedido);
    }

    /**
     * Cliente busca seu histórico de pedidos.
     */
    @GetMapping("/meus-pedidos")
    public ResponseEntity<List<Pedido>> getMeusPedidos() {
        // A lógica foi movida para o service
        List<Pedido> pedidos = pedidoService.getMeusPedidos();
        return ResponseEntity.ok(pedidos);
    }
}