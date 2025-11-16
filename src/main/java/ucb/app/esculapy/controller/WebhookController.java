package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.dto.WebhookPagamentoRequest;
import ucb.app.esculapy.service.PagamentoService;

/**
 * Controller PÚBLICO para receber webhooks de serviços externos.
 * A segurança aqui é feita por uma "secret key" na requisição,
 * e não por token JWT.
 */
@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final PagamentoService pagamentoService;

    /**
     * Endpoint que o Gateway de Pagamento (Stripe, PagSeguro, etc.)
     * irá chamar quando um pagamento for processado.
     */
    @PostMapping("/pagamento")
    public ResponseEntity<Void> receberWebhookPagamento(
            @Valid @RequestBody WebhookPagamentoRequest request
    ) {
        pagamentoService.processarWebhook(request);
        return ResponseEntity.ok().build();
    }
}