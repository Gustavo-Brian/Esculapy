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

/**
 * Controlador REST para o farmacêutico de uma farmácia.
 * Acesso restrito a usuários com a role 'FARMACEUTICO'.
 * Gerencia a visualização de pedidos e a validação de receitas.
 */
@RestController
@RequestMapping("/api/farmaceutico")
@PreAuthorize("hasRole('FARMACEUTICO')")
@RequiredArgsConstructor
public class FarmaceuticoController {

    private final PedidoService pedidoService;

    /**
     * Lista os pedidos que estão pendentes de validação de receita pelo farmacêutico logado.
     *
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link Pedido}.
     */
    @GetMapping("/pedidos/pendentes")
    public ApiResponse<Page<Pedido>> getPedidosPendentes(Pageable pageable) {
        Page<Pedido> pedidos = pedidoService.getPedidosPendentesFarmaceutico(pageable);
        return ApiResponse.success(pedidos);
    }

    /**
     * Obtém os detalhes de um pedido específico para o farmacêutico.
     *
     * @param pedidoId O ID do pedido.
     * @return Uma resposta de API contendo o objeto {@link Pedido}.
     */
    @GetMapping("/pedidos/{pedidoId}")
    public ApiResponse<Pedido> getPedidoDetalhes(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.getPedidoDetalhesFarmaceutico(pedidoId);
        return ApiResponse.success(pedido);
    }

    /**
     * Aprova a receita médica associada a um pedido, permitindo que o pedido prossiga.
     *
     * @param pedidoId O ID do pedido cuja receita será aprovada.
     * @return Uma resposta de API contendo o objeto {@link Pedido} atualizado.
     */
    @PostMapping("/pedidos/{pedidoId}/receita/aprovar")
    public ApiResponse<Pedido> aprovarReceita(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.aprovarReceita(pedidoId);
        return ApiResponse.success(pedido);
    }

    /**
     * Rejeita a receita médica associada a um pedido, com uma justificativa.
     *
     * @param pedidoId O ID do pedido cuja receita será rejeitada.
     * @param request O DTO contendo a justificativa da rejeição.
     * @return Uma resposta de API contendo o objeto {@link Pedido} atualizado.
     */
    @PostMapping("/pedidos/{pedidoId}/receita/rejeitar")
    public ApiResponse<Pedido> rejeitarReceita(
            @PathVariable Long pedidoId,
            @Valid @RequestBody ValidacaoReceitaRequest request
    ) {
        Pedido pedido = pedidoService.rejeitarReceita(pedidoId, request.getJustificativa());
        return ApiResponse.success(pedido);
    }
}