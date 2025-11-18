package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.ValidacaoReceitaRequest;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.service.PedidoService;

@RestController
@RequestMapping("/api/farmaceutico")
@PreAuthorize("hasRole('FARMACEUTICO')")
@RequiredArgsConstructor
public class FarmaceuticoController {

    private final PedidoService pedidoService;

    @GetMapping("/pedidos/pendentes")
    public ApiResponse<Page<Pedido>> getPedidosPendentes(Pageable pageable) {
        Page<Pedido> pedidos = pedidoService.getPedidosPendentesFarmaceutico(pageable);
        return ApiResponse.success(pedidos);
    }

    // --- ENDPOINT ADICIONADO (da lista) ---
    @GetMapping("/pedidos/{pedidoId}")
    public ApiResponse<Pedido> getPedidoDetalhes(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.getPedidoDetalhesFarmaceutico(pedidoId);
        return ApiResponse.success(pedido);
    }

    @PostMapping("/pedidos/{pedidoId}/receita/aprovar")
    public ApiResponse<Pedido> aprovarReceita(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.aprovarReceita(pedidoId);
        return ApiResponse.success(pedido);
    }

    @PostMapping("/pedidos/{pedidoId}/receita/rejeitar")
    public ApiResponse<Pedido> rejeitarReceita(
            @PathVariable Long pedidoId,
            @Valid @RequestBody ValidacaoReceitaRequest request
    ) {
        Pedido pedido = pedidoService.rejeitarReceita(pedidoId, request.getJustificativa());
        return ApiResponse.success(pedido);
    }
}