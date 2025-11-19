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

/**
 * Controlador REST para operações relacionadas a pedidos do cliente.
 * Acesso restrito a usuários com a role 'CLIENTE'.
 */
@RestController
@RequestMapping("/api/pedidos")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;
    private final PagamentoService pagamentoService;

    /**
     * Cria um novo pedido a partir dos itens e endereço de entrega fornecidos.
     *
     * @param request O DTO contendo a lista de itens e o ID do endereço.
     * @return Uma resposta de API contendo o objeto {@link Pedido} criado.
     */
    @PostMapping
    public ApiResponse<Pedido> criarPedido(
            @Valid @RequestBody CriarPedidoRequest request
    ) {
        Pedido pedidoCriado = pedidoService.criarPedido(request);
        return ApiResponse.success(pedidoCriado);
    }

    /**
     * Anexa um arquivo de receita médica (MultipartFile) a um pedido existente.
     *
     * @param pedidoId O ID do pedido.
     * @param arquivo O arquivo da receita.
     * @return Uma resposta de API contendo o objeto {@link Pedido} atualizado.
     */
    @PostMapping("/{pedidoId}/receita")
    public ApiResponse<Pedido> uploadReceita(
            @PathVariable Long pedidoId,
            @RequestParam("arquivo") MultipartFile arquivo
    ) {
        Pedido pedido = pedidoService.anexarReceita(pedidoId, arquivo);
        return ApiResponse.success(pedido);
    }

    /**
     * Lista todos os pedidos realizados pelo cliente logado, com suporte a paginação.
     *
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link Pedido}.
     */
    @GetMapping("/meus-pedidos")
    public ApiResponse<Page<Pedido>> getMeusPedidos(Pageable pageable) {
        Page<Pedido> pedidos = pedidoService.getMeusPedidos(pageable);
        return ApiResponse.success(pedidos);
    }

    /**
     * Obtém os detalhes de um pedido específico do cliente logado.
     *
     * @param pedidoId O ID do pedido.
     * @return Uma resposta de API contendo o objeto {@link Pedido}.
     */
    @GetMapping("/{pedidoId}")
    public ApiResponse<Pedido> getPedidoPorId(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.getPedidoDetalhesCliente(pedidoId);
        return ApiResponse.success(pedido);
    }

    /**
     * Cria uma sessão de pagamento (checkout) para um pedido pendente.
     *
     * @param pedidoId O ID do pedido a ser pago.
     * @return Uma resposta de API contendo o {@link PagamentoResponse} com os detalhes para iniciar o pagamento.
     */
    @PostMapping("/{pedidoId}/pagar")
    public ApiResponse<PagamentoResponse> pagarPedido(
            @PathVariable Long pedidoId
    ) {
        PagamentoResponse response = pagamentoService.criarSessaoDePagamento(pedidoId);
        return ApiResponse.success(response);
    }

    /**
     * Cancela um pedido que ainda está em um status que permite cancelamento.
     *
     * @param pedidoId O ID do pedido a ser cancelado.
     * @return Uma resposta de API contendo o objeto {@link Pedido} atualizado para o status CANCELADO.
     */
    @PostMapping("/{pedidoId}/cancelar")
    public ApiResponse<Pedido> cancelarPedido(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.cancelarPedido(pedidoId);
        return ApiResponse.success(pedido);
    }
}