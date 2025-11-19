package ucb.app.esculapy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * DTO de resposta contendo informações para iniciar um pagamento externo,
 * como a URL de redirecionamento para o gateway de pagamento.
 */
@Data
@AllArgsConstructor
public class PagamentoResponse {

    /**
     * A URL de checkout gerada pelo gateway de pagamento.
     * O frontend deve redirecionar o usuário para esta URL.
     */
    private String urlPagamento;
}