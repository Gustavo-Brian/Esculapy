package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.PagamentoResponse; // --- IMPORT ADICIONADO ---
import ucb.app.esculapy.dto.WebhookPagamentoRequest;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.Cliente; // --- IMPORT ADICIONADO ---
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.model.enums.PedidoStatus;
import ucb.app.esculapy.repository.PedidoRepository;

@Service
@RequiredArgsConstructor
public class PagamentoService {

    private final PedidoRepository pedidoRepository;
    private final AuthenticationService authenticationService; // --- DEPENDÊNCIA ADICIONADA ---

    @Value("${pagamento.webhook.secret}")
    private String webhookSecretaCorreta;

    // --- NOVO MÉTODO ADICIONADO ---
    @Transactional(readOnly = true)
    public PagamentoResponse criarSessaoDePagamento(Long pedidoId) {
        Cliente cliente = authenticationService.getClienteLogado();

        // 1. Busca o pedido
        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido com ID " + pedidoId + " não encontrado."));

        // 2. Valida a posse (se o pedido é do cliente logado)
        if (!pedido.getCliente().getId().equals(cliente.getId())) {
            throw new ForbiddenException("Você não tem permissão para pagar este pedido.");
        }

        // 3. Valida o status
        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_PAGAMENTO) {
            throw new ConflictException("Este pedido não está aguardando pagamento. Status atual: " + pedido.getStatus());
        }

        // 4. (SIMULAÇÃO) Chamar a API do Gateway de Pagamento
        // Aqui você chamaria a API do Stripe/PagSeguro/etc.
        // e passaria o ID do pedido, o valor total e os dados do cliente.
        // ex: String urlStripe = stripeService.criarCheckout(pedido, cliente);

        System.out.println("LOG: [PagamentoService] Simulando criação de sessão de pagamento para o Pedido ID: " + pedidoId);
        System.out.println("LOG: [PagamentoService] Valor: " + pedido.getValorTotal());

        // 5. Retorna a URL (Simulada)
        // O frontend irá redirecionar o cliente para esta URL.
        // O 'pedidoId' na URL é crucial para o webhook saber qual pedido foi pago.
        String urlPagamentoSimulada = "https://gateway.pagamento.simulado/pagar?pedidoId=" + pedido.getId() + "&valor=" + pedido.getValorTotal();

        return new PagamentoResponse(urlPagamentoSimulada);
    }
    // --- FIM DO NOVO MÉTODO ---


    @Transactional
    public void processarWebhook(WebhookPagamentoRequest request) {

        // 1. VERIFICAÇÃO DE SEGURANÇA
        if (!webhookSecretaCorreta.equals(request.getSecretKey())) {
            throw new ForbiddenException("Chave secreta do webhook inválida.");
        }

        // 2. PROCESSAR APENAS SE O PAGAMENTO FOI APROVADO
        if (!"PAGO".equalsIgnoreCase(request.getStatusPagamento())) {
            return;
        }

        // 3. BUSCAR O PEDIDO
        Pedido pedido = pedidoRepository.findById(request.getPedidoId())
                .orElseThrow(() -> new ResourceNotFoundException("Pedido com ID " + request.getPedidoId() + " não encontrado."));

        // 4. VERIFICAÇÃO DE ESTADO (Idempotência)
        if (pedido.getStatus() == PedidoStatus.PAGAMENTO_APROVADO) {
            return; // Já foi processado
        }

        if (pedido.getStatus() != PedidoStatus.AGUARDANDO_PAGAMENTO) {
            throw new ConflictException("O pedido " + pedido.getId() + " não está aguardando pagamento. Status atual: " + pedido.getStatus());
        }

        // 5. ATUALIZAR O PEDIDO
        pedido.setStatus(PedidoStatus.PAGAMENTO_APROVADO);
        pedidoRepository.save(pedido);
    }
}