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

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PedidoRepository pedidoRepository;
    private final AuthenticationService authenticationService;

    @Value("${pagamento.webhook.secret}")
    private String webhookSecretaCorreta;

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

        // (Simulação de chamada ao Gateway)
        System.out.println("LOG: [PagamentoService] Simulando criação de sessão de pagamento para o Pedido ID: " + pedidoId);
        String urlPagamentoSimulada = "https://gateway.pagamento.simulado/pagar?pedidoId=" + pedido.getId() + "&valor=" + pedido.getValorTotal();

        return new PagamentoResponse(urlPagamentoSimulada);
    }

    @Transactional
    public void processarWebhook(WebhookPagamentoRequest request) {

        // 1. Validação de Segurança
        if (!webhookSecretaCorreta.equals(request.getSecretKey())) {
            throw new ForbiddenException("Chave secreta do webhook inválida.");
        }

        // 2. Processar apenas sucesso
        if (!"PAGO".equalsIgnoreCase(request.getStatusPagamento())) {
            return;
        }

        // 3. Buscar o Pedido
        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido com ID " + request.getPedidoId() + " não encontrado."));

        // 4. Idempotência
        if (pedido.getStatus() == PedidoStatus.AGUARDANDO_CONFIRMACAO ||
                pedido.getStatus() == PedidoStatus.CONFIRMADO ||
                pedido.getStatus() == PedidoStatus.EM_PREPARACAO ||
                pedido.getStatus() == PedidoStatus.PRONTO_PARA_ENTREGA ||
                pedido.getStatus() == PedidoStatus.EM_TRANSPORTE ||
                pedido.getStatus() == PedidoStatus.ENTREGUE) {
            return; // Já foi pago
        }

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_PAGAMENTO) {
            throw new ConflictException("O pedido " + pedido.getId() + " não está aguardando pagamento. Status atual: " + pedido.getStatus());
        }

        // 5. Mudar Status
        // Agora o pedido vai para AGUARDANDO_CONFIRMACAO (Farmácia precisa aceitar)
        pedido.setStatus(PedidoStatus.AGUARDANDO_CONFIRMACAO);
        pedidoRepository.save(pedido);
    }
}