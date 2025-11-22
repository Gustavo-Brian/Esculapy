package ucb.app.esculapy.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import ucb.app.esculapy.dto.CriarPedidoRequest;
import ucb.app.esculapy.dto.ItemCarrinho;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.model.*;
import ucb.app.esculapy.model.enums.PedidoStatus;
import ucb.app.esculapy.model.enums.TipoReceita;
import ucb.app.esculapy.repository.EnderecoRepository;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.PedidoRepository;
import ucb.app.esculapy.repository.ReceitaRepository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PedidoServiceTest {

    @InjectMocks
    private PedidoService pedidoService;

    // Mocks dos Repositórios e Serviços que o PedidoService usa
    @Mock private PedidoRepository pedidoRepository;
    @Mock private EstoqueLojistaRepository estoqueLojistaRepository;
    @Mock private EnderecoRepository enderecoRepository;
    @Mock private AuthenticationService authenticationService;
    @Mock private StorageService storageService;
    @Mock private ReceitaRepository receitaRepository;

    // ------------------------------------------------------------------------
    // CENÁRIO 1: Compra de Medicamento Controlado (Exige Receita)
    // ------------------------------------------------------------------------
    @Test
    @DisplayName("CENÁRIO 01: Deve bloquear pedido aguardando receita e calcular total")
    void criarPedidoComReceita() {
        // --- ARRANGE (PREPARAÇÃO) ---
        Long clienteId = 1L;
        Long estoqueId = 10L;
        BigDecimal precoUnitario = new BigDecimal("50.00");
        int quantidadeSolicitada = 2;

        // 1. Simula Cliente Logado
        Cliente clienteMock = new Cliente();
        clienteMock.setId(clienteId);
        when(authenticationService.getClienteLogado()).thenReturn(clienteMock);

        // 2. Simula Endereço Válido
        when(enderecoRepository.findByIdAndClienteId(any(), eq(clienteId)))
                .thenReturn(Optional.of(new Endereco()));

        // 3. Simula Produto Controlado (TipoReceita != NAO_EXIGIDO)
        Produto produtoControlado = new Produto();
        produtoControlado.setNome("Antibiótico");
        produtoControlado.setTipoReceita(TipoReceita.BRANCA_SIMPLES);

        // 4. Simula Estoque Disponível
        EstoqueLojista estoqueMock = new EstoqueLojista();
        estoqueMock.setId(estoqueId);
        estoqueMock.setPreco(precoUnitario);
        estoqueMock.setQuantidade(10); // Tem 10 no estoque
        estoqueMock.setProduto(produtoControlado);

        when(estoqueLojistaRepository.findById(estoqueId)).thenReturn(Optional.of(estoqueMock));

        // 5. Simula o salvamento (Retorna o próprio objeto passado)
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // --- ACT (AÇÃO) ---
        CriarPedidoRequest request = new CriarPedidoRequest();
        request.setEnderecoId(500L);
        ItemCarrinho item = new ItemCarrinho();
        item.setEstoqueLojistaId(estoqueId);
        item.setQuantidade(quantidadeSolicitada);
        request.setItens(List.of(item));

        Pedido pedidoCriado = pedidoService.criarPedido(request);

        // --- ASSERT (VERIFICAÇÃO) ---
        // Valida Cálculo: 50.00 * 2 = 100.00
        assertThat(pedidoCriado.getValorTotal()).isEqualByComparingTo(new BigDecimal("100.00"));

        // Valida Fluxo: Deve exigir receita
        assertThat(pedidoCriado.getStatus()).isEqualTo(PedidoStatus.AGUARDANDO_RECEITA);

        // Valida Baixa de Estoque em Memória: 10 - 2 = 8
        assertThat(estoqueMock.getQuantidade()).isEqualTo(8);
    }

    // ------------------------------------------------------------------------
    // CENÁRIO 2: Compra Simples (Sem Receita)
    // ------------------------------------------------------------------------
    @Test
    @DisplayName("CENÁRIO 02: Deve ir direto para pagamento se não exigir receita")
    void criarPedidoSemReceita() {
        // --- ARRANGE ---
        when(authenticationService.getClienteLogado()).thenReturn(new Cliente());
        when(enderecoRepository.findByIdAndClienteId(any(), any())).thenReturn(Optional.of(new Endereco()));

        // Produto Livre (TipoReceita == NAO_EXIGIDO)
        Produto produtoLivre = new Produto();
        produtoLivre.setTipoReceita(TipoReceita.NAO_EXIGIDO);

        EstoqueLojista estoqueMock = new EstoqueLojista();
        estoqueMock.setPreco(BigDecimal.TEN);
        estoqueMock.setQuantidade(100);
        estoqueMock.setProduto(produtoLivre);

        when(estoqueLojistaRepository.findById(any())).thenReturn(Optional.of(estoqueMock));
        when(pedidoRepository.save(any(Pedido.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // --- ACT ---
        CriarPedidoRequest request = new CriarPedidoRequest();
        request.setEnderecoId(1L);
        ItemCarrinho item = new ItemCarrinho();
        item.setEstoqueLojistaId(1L);
        item.setQuantidade(1);
        request.setItens(List.of(item));

        Pedido pedidoCriado = pedidoService.criarPedido(request);

        // --- ASSERT ---
        // Status deve pular a etapa de receita
        assertThat(pedidoCriado.getStatus()).isEqualTo(PedidoStatus.AGUARDANDO_PAGAMENTO);
    }

    // ------------------------------------------------------------------------
    // CENÁRIO 3: Erro de Estoque Insuficiente
    // ------------------------------------------------------------------------
    @Test
    @DisplayName("CENÁRIO 03: Deve lançar erro ao tentar comprar mais que o estoque")
    void erroEstoqueInsuficiente() {
        // --- ARRANGE ---
        when(authenticationService.getClienteLogado()).thenReturn(new Cliente());
        when(enderecoRepository.findByIdAndClienteId(any(), any())).thenReturn(Optional.of(new Endereco()));

        // Estoque Baixo
        EstoqueLojista estoqueBaixo = new EstoqueLojista();
        estoqueBaixo.setQuantidade(5); // Só tem 5
        estoqueBaixo.setProduto(new Produto());

        when(estoqueLojistaRepository.findById(any())).thenReturn(Optional.of(estoqueBaixo));

        // --- ACT ---
        CriarPedidoRequest request = new CriarPedidoRequest();
        request.setEnderecoId(1L);
        ItemCarrinho item = new ItemCarrinho();
        item.setEstoqueLojistaId(1L);
        item.setQuantidade(6); // Tenta comprar 6 (Erro!)
        request.setItens(List.of(item));

        // --- ASSERT ---
        ConflictException exception = assertThrows(ConflictException.class, () -> {
            pedidoService.criarPedido(request);
        });

        assertThat(exception.getMessage()).contains("Estoque insuficiente");

        // Garante que NADA foi salvo no banco
        verify(pedidoRepository, never()).save(any());
    }

    // ------------------------------------------------------------------------
    // CENÁRIO 4: Cancelamento e Estorno
    // ------------------------------------------------------------------------
    @Test
    @DisplayName("CENÁRIO 04: Ao cancelar, deve devolver itens ao estoque")
    void cancelarPedidoComEstorno() {
        // --- ARRANGE ---
        Long clienteId = 1L;
        Cliente cliente = new Cliente(); cliente.setId(clienteId);

        // O Estoque Original no Banco
        EstoqueLojista estoqueNoBanco = new EstoqueLojista();
        estoqueNoBanco.setId(99L);
        estoqueNoBanco.setQuantidade(90); // Tem 90 lá na loja

        // O Pedido que será cancelado
        Pedido pedidoParaCancelar = new Pedido();
        pedidoParaCancelar.setId(100L);
        pedidoParaCancelar.setCliente(cliente);
        pedidoParaCancelar.setStatus(PedidoStatus.AGUARDANDO_PAGAMENTO);

        // O item dentro do pedido (comprou 10 unidades)
        ItemPedido itemPedido = new ItemPedido();
        itemPedido.setQuantidade(10);
        itemPedido.setEstoqueLojista(estoqueNoBanco);
        pedidoParaCancelar.setItens(List.of(itemPedido));

        when(authenticationService.getClienteLogado()).thenReturn(cliente);
        when(pedidoRepository.findById(100L)).thenReturn(Optional.of(pedidoParaCancelar));
        when(pedidoRepository.save(any())).thenReturn(pedidoParaCancelar);

        // --- ACT ---
        pedidoService.cancelarPedido(100L);

        // --- ASSERT ---
        // 1. Status mudou?
        assertThat(pedidoParaCancelar.getStatus()).isEqualTo(PedidoStatus.CANCELADO);

        // 2. Estoque voltou? (90 que tinha + 10 do pedido = 100)
        assertThat(estoqueNoBanco.getQuantidade()).isEqualTo(100);

        // 3. Salvou a alteração do estoque no banco?
        verify(estoqueLojistaRepository).save(estoqueNoBanco);
    }

    // ------------------------------------------------------------------------
    // CENÁRIO 5: Proteção de Status Final
    // ------------------------------------------------------------------------
    @Test
    @DisplayName("CENÁRIO 05: Não deve permitir cancelar pedido já ENTREGUE")
    void erroCancelarPedidoEntregue() {
        // --- ARRANGE ---
        Long clienteId = 1L;
        Cliente cliente = new Cliente(); cliente.setId(clienteId);

        Pedido pedidoEntregue = new Pedido();
        pedidoEntregue.setId(200L);
        pedidoEntregue.setCliente(cliente);
        pedidoEntregue.setStatus(PedidoStatus.ENTREGUE); // Já finalizado

        when(authenticationService.getClienteLogado()).thenReturn(cliente);
        when(pedidoRepository.findById(200L)).thenReturn(Optional.of(pedidoEntregue));

        // --- ACT & ASSERT ---
        ConflictException exception = assertThrows(ConflictException.class, () -> {
            pedidoService.cancelarPedido(200L);
        });

        assertThat(exception.getMessage()).contains("não pode mais ser cancelado");

        // Verifica que o status NÃO mudou
        assertThat(pedidoEntregue.getStatus()).isEqualTo(PedidoStatus.ENTREGUE);
    }
}