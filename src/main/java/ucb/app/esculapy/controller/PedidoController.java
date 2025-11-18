package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.CriarPedidoRequest;
import ucb.app.esculapy.dto.PagamentoResponse;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.service.PagamentoService;
import ucb.app.esculapy.service.PedidoService;

@RestController
@RequestMapping("/api/pedidos")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;
    private final PagamentoService pagamentoService;

    @PostMapping
    public ApiResponse<Pedido> criarPedido(
            @Valid @RequestBody CriarPedidoRequest request
    ) {
        Pedido pedidoCriado = pedidoService.criarPedido(request);
        return ApiResponse.success(pedidoCriado);
    }

    @PostMapping("/{pedidoId}/receita")
    public ApiResponse<Pedido> uploadReceita(
            @PathVariable Long pedidoId,
            @RequestParam("arquivo") MultipartFile arquivo
    ) {
        Pedido pedido = pedidoService.anexarReceita(pedidoId, arquivo);
        return ApiResponse.success(pedido);
    }

    @GetMapping("/meus-pedidos")
    public ApiResponse<Page<Pedido>> getMeusPedidos(Pageable pageable) {
        Page<Pedido> pedidos = pedidoService.getMeusPedidos(pageable);
        return ApiResponse.success(pedidos);
    }

    @GetMapping("/{pedidoId}")
    public ApiResponse<Pedido> getPedidoPorId(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.getPedidoDetalhesCliente(pedidoId);
        return ApiResponse.success(pedido);
    }

    @PostMapping("/{pedidoId}/pagar")
    public ApiResponse<PagamentoResponse> pagarPedido(
            @PathVariable Long pedidoId
    ) {
        PagamentoResponse response = pagamentoService.criarSessaoDePagamento(pedidoId);
        return ApiResponse.success(response);
    }

    @PostMapping("/{pedidoId}/cancelar")
    public ApiResponse<Pedido> cancelarPedido(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.cancelarPedido(pedidoId);
        return ApiResponse.success(pedido);
    }
}