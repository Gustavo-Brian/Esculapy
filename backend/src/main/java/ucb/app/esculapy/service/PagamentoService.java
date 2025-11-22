package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.PagamentoResponse;
import ucb.app.esculapy.dto.WebhookPagamentoRequest;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.model.enums.PedidoStatus;
import ucb.app.esculapy.repository.PedidoRepository;

/**
 * Serviço responsável por integrar com o gateway de pagamento (simulado)
 * e processar webhooks de pagamento.
 */
@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PedidoRepository pedidoRepository;
    private final AuthenticationService authenticationService;

    @Value("${pagamento.webhook.secret}")
    private String webhookSecretaCorreta;

    /**
     * Simula a criação de uma sessão de pagamento em um gateway e retorna a URL de checkout.
     *
     * @param pedidoId O ID do pedido a ser pago.
     * @return O DTO {@link PagamentoResponse} contendo a URL.
     * @throws ResourceNotFoundException Se o pedido não for encontrado.
     * @throws ForbiddenException Se o pedido não pertencer ao cliente logado.
     * @throws ConflictException Se o pedido não estiver no status AGUARDANDO_PAGAMENTO.
     */
    @Transactional(readOnly = true)
    public PagamentoResponse criarSessaoDePagamento(Long pedidoId) {
        Cliente cliente = authenticationService.getClienteLogado();

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido com ID " + pedidoId + " não encontrado."));

        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new ForbiddenException("Você não tem permissão para pagar este pedido.");
        }

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_PAGAMENTO) {
            throw new ConflictException("Este pedido não está aguardando pagamento. Status atual: " + pedido.getStatus());
        }

        System.out.println("LOG: [PagamentoService] Simulando criação de sessão de pagamento para o Pedido ID: " + pedidoId);
        String urlPagamentoSimulada = "https://gateway.pagamento.simulado/pagar?pedidoId=" + pedido.getId() + "&valor=" + pedido.getValorTotal();

        return new PagamentoResponse(urlPagamentoSimulada);
    }

    /**
     * Processa um webhook de pagamento recebido do gateway.
     *
     * @param request O DTO {@link WebhookPagamentoRequest} contendo o status e a chave secreta.
     * @throws ForbiddenException Se a chave secreta for inválida.
     * @throws ResourceNotFoundException Se o pedido não for encontrado.
     * @throws ConflictException Se o pedido não estiver no status correto.
     */
    @Transactional
    public void processarWebhook(WebhookPagamentoRequest request) {

        if (!webhookSecretaCorreta.equals(request.getSecretKey())) {
            throw new ForbiddenException("Chave secreta do webhook inválida.");
        }

        if (!"PAGO".equalsIgnoreCase(request.getStatusPagamento())) {
            return;
        }

        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido com ID " + request.getPedidoId() + " não encontrado."));

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_PAGAMENTO) {
            return;
        }

        pedido.setStatus(PedidoStatus.AGUARDANDO_CONFIRMACAO);
        pedidoRepository.save(pedido);
    }
}