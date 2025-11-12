package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.PedidoStatusUpdateRequest;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.model.enums.PedidoStatus;
import ucb.app.esculapy.repository.PedidoRepository;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PedidoManagementService {

    private final PedidoRepository pedidoRepository;
    private final AuthenticationService authenticationService;

    /**
     * Busca todos os pedidos da Farmácia logada que estão prontos para processamento.
     */
    @Transactional(readOnly = true)
    public List<Pedido> getPedidosFarmacia() {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Long farmaciaId = farmacia.getId();

        // Simulação de busca otimizada (na implementação real, usar JOIN FETCH)
        List<Pedido> todosPedidos = pedidoRepository.findAll();

        return todosPedidos.stream()
                .filter(p -> p.getItens().stream()
                        .anyMatch(i -> Objects.equals(i.getEstoqueLojista().getFarmacia().getId(), farmaciaId))
                )
                .collect(Collectors.toList());
    }

    /**
     * Atualiza o status do pedido dentro do fluxo da Farmácia.
     */
    @Transactional
    public Pedido updateStatus(Long pedidoId, PedidoStatusUpdateRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Long farmaciaId = farmacia.getId();

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido com ID " + pedidoId + " não encontrado."));

        // 1. VALIDAÇÃO DE POSSE
        boolean isFarmaciaOwner = pedido.getItens().stream()
                .anyMatch(i -> Objects.equals(i.getEstoqueLojista().getFarmacia().getId(), farmaciaId));

        if (!isFarmaciaOwner) {
            throw new ForbiddenException("Você não tem permissão para gerenciar este pedido.");
        }

        // 2. VALIDAÇÃO DE TRANSIÇÃO DE STATUS (Exemplo)
        PedidoStatus novoStatus = request.getStatus(); // <-- CORREÇÃO AQUI

        if (pedido.getStatus() == PedidoStatus.CANCELADO) {
            throw new ForbiddenException("Pedido cancelado não pode ter o status alterado.");
        }
        // Exemplo: Permitir mudança de 'PAGAMENTO_APROVADO' para 'EM_SEPARACAO'
        if (novoStatus == PedidoStatus.EM_SEPARACAO && pedido.getStatus() != PedidoStatus.PAGAMENTO_APROVADO) {
            throw new ForbiddenException("Não é possível iniciar a separação sem pagamento aprovado.");
        }


        // 3. Aplica o novo status
        pedido.setStatus(novoStatus);
        return pedidoRepository.save(pedido);
    }
}