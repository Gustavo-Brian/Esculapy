package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.WebhookPagamentoRequest;
import ucb.app.esculapy.service.PagamentoService;

/**
 * Controlador REST para receber webhooks de serviços externos (ex: gateway de pagamento).
 * Não requer autenticação, pois é chamado pelo serviço externo.
 */
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final PagamentoService pagamentoService;

    /**
     * Endpoint para receber notificações de webhook sobre o status de pagamento.
     *
     * @param request O DTO contendo os dados do evento de pagamento.
     * @return Uma resposta de API de sucesso após o processamento.
     */
    @PostMapping("/pagamento")
    public ApiResponse<Object> receberWebhookPagamento(
            @Valid @RequestBody WebhookPagamentoRequest request
    ) {
        pagamentoService.processarWebhook(request);
        return ApiResponse.success("Webhook processado com sucesso");
    }
}