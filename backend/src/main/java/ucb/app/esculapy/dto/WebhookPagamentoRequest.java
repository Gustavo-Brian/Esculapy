package ucb.app.esculapy.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * DTO para receber a notificação de webhook de um gateway de pagamento.
 */
@Data
public class WebhookPagamentoRequest {

    @NotNull
    private Long pedidoId;

    /**
     * O status enviado pelo gateway, ex: "PAGO", "RECUSADO".
     */
    @NotBlank
    private String statusPagamento;

    /**
     * Chave secreta de autenticação do Webhook para garantir
     * que a requisição é legítima e veio do gateway.
     */
    @NotBlank
    private String secretKey;
}