package ucb.app.esculapy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor // Para facilitar a criação
public class PagamentoResponse {

    /**
     * A URL de checkout gerada pelo gateway de pagamento.
     * O frontend deve redirecionar o usuário para esta URL.
     */
    private String urlPagamento;
}