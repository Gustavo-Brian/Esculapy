package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.*;
import ucb.app.esculapy.model.*;
import ucb.app.esculapy.service.CatalogoService;
import ucb.app.esculapy.service.FarmaciaService;
import ucb.app.esculapy.service.PedidoService;

@RestController
@RequestMapping("/api/farmacia-admin")
@PreAuthorize("hasRole('ROLE_LOJISTA_ADMIN')")
@RequiredArgsConstructor
public class FarmaciaAdminController {

    private final FarmaciaService farmaciaService;
    private final CatalogoService catalogoService;
    private final PedidoService pedidoService;

    // --- Gerenciamento da Própria Farmácia ---

    @GetMapping("/minha-farmacia")
    public ApiResponse<Farmacia> getMinhaFarmacia() {
        Farmacia farmacia = farmaciaService.getMinhaFarmaciaCompleta();
        return ApiResponse.success(farmacia);
    }

    @PutMapping("/minha-farmacia/info")
    public ApiResponse<FarmaciaInfoRequest> updateMinhaFarmaciaInfo(
            @Valid @RequestBody FarmaciaInfoRequest request) {
        FarmaciaInfoRequest info = farmaciaService.updateInfo(request);
        return ApiResponse.success(info);
    }

    @PutMapping("/minha-farmacia/endereco")
    public ApiResponse<Endereco> updateMeuEndereco(
            @Valid @RequestBody EnderecoRequest request) {
        Endereco endereco = farmaciaService.updateEndereco(request);
        return ApiResponse.success(endereco);
    }

    @PutMapping("/minha-farmacia/conta-bancaria")
    public ApiResponse<ContaBancaria> updateMinhaContaBancaria(
            @Valid @RequestBody ContaBancariaRequest request) {
        ContaBancaria conta = farmaciaService.updateContaBancaria(request);
        return ApiResponse.success(conta);
    }

    // --- Gerenciamento de Funcionários ---

    @PostMapping("/farmaceuticos")
    public ApiResponse<Farmaceutico> adicionarFarmaceutico(@Valid @RequestBody RegisterFarmaceuticoRequest request) {
        Farmaceutico novoFarmaceutico = farmaciaService.adicionarFarmaceutico(request);
        return ApiResponse.success(novoFarmaceutico);
    }

    @GetMapping("/farmaceuticos")
    public ApiResponse<Page<Farmaceutico>> listarFarmaceuticos(Pageable pageable) {
        Page<Farmaceutico> farmaceuticos = farmaciaService.listarFarmaceuticos(pageable);
        return ApiResponse.success(farmaceuticos);
    }

    @PutMapping("/farmaceuticos/{farmaceuticoId}")
    public ApiResponse<Farmaceutico> atualizarFarmaceutico(
            @PathVariable Long farmaceuticoId,
            @Valid @RequestBody FarmaceuticoUpdateRequest request
    ) {
        Farmaceutico farmaceutico = farmaciaService.atualizarFarmaceutico(farmaceuticoId, request);
        return ApiResponse.success(farmaceutico);
    }

    @PostMapping("/farmaceuticos/{farmaceuticoId}/desativar")
    public ApiResponse<Object> desativarFarmaceutico(@PathVariable Long farmaceuticoId) {
        farmaciaService.desativarFarmaceutico(farmaceuticoId);
        return ApiResponse.success("Farmacêutico desativado com sucesso");
    }

    @PostMapping("/farmaceuticos/{farmaceuticoId}/reativar")
    public ApiResponse<Object> reativarFarmaceutico(@PathVariable Long farmaceuticoId) {
        farmaciaService.reativarFarmaceutico(farmaceuticoId);
        return ApiResponse.success("Farmacêutico reativado com sucesso");
    }

    @DeleteMapping("/farmaceuticos/{farmaceuticoId}")
    public ApiResponse<Object> deletarFarmaceutico(@PathVariable Long farmaceuticoId) {
        farmaciaService.deletarFarmaceutico(farmaceuticoId);
        return ApiResponse.success("Farmacêutico deletado permanentemente");
    }

    // --- Gerenciamento de Estoque ---

    @PostMapping("/estoque")
    public ApiResponse<EstoqueLojista> adicionarItemEstoque(@Valid @RequestBody EstoqueRequest request) {
        EstoqueLojista novoItem = catalogoService.adicionarItemEstoque(request);
        return ApiResponse.success(novoItem);
    }

    @GetMapping("/estoque")
    public ApiResponse<Page<EstoqueLojista>> getEstoqueDaFarmacia(Pageable pageable) {
        Page<EstoqueLojista> estoque = catalogoService.getEstoquePrivadoDaFarmaciaLogada(pageable);
        return ApiResponse.success(estoque);
    }

    @PutMapping("/estoque/{estoqueId}")
    public ApiResponse<EstoqueLojista> atualizarEstoque(
            @PathVariable Long estoqueId,
            @Valid @RequestBody EstoqueRequest request) {
        EstoqueLojista itemAtualizado = catalogoService.updateEstoque(estoqueId, request);
        return ApiResponse.success(itemAtualizado);
    }

    @DeleteMapping("/estoque/{estoqueId}")
    public ApiResponse<Object> deletarEstoque(@PathVariable Long estoqueId) {
        catalogoService.deleteEstoque(estoqueId);
        return ApiResponse.success("Item de estoque deletado com sucesso");
    }

    @PostMapping("/estoque/{estoqueId}/ativar")
    public ApiResponse<EstoqueLojista> ativarEstoque(@PathVariable Long estoqueId) {
        EstoqueLojista item = catalogoService.setEstoqueAtivo(estoqueId, true);
        return ApiResponse.success(item);
    }

    @PostMapping("/estoque/{estoqueId}/desativar")
    public ApiResponse<EstoqueLojista> desativarEstoque(@PathVariable Long estoqueId) {
        EstoqueLojista item = catalogoService.setEstoqueAtivo(estoqueId, false);
        return ApiResponse.success(item);
    }

    // --- Gerenciamento de Pedidos ---

    @GetMapping("/pedidos")
    public ApiResponse<Page<Pedido>> getPedidosDaFarmacia(Pageable pageable) {
        Page<Pedido> pedidos = pedidoService.getPedidosDaFarmaciaLogada(pageable);
        return ApiResponse.success(pedidos);
    }

    @GetMapping("/pedidos/{pedidoId}")
    public ApiResponse<Pedido> getPedidoDetalhesLojista(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.getPedidoDetalhesLojista(pedidoId);
        return ApiResponse.success(pedido);
    }

    @PutMapping("/pedidos/{pedidoId}/status")
    public ApiResponse<Pedido> atualizarStatusPedido(
            @PathVariable Long pedidoId,
            @Valid @RequestBody PedidoStatusUpdateRequest request) {
        Pedido pedidoAtualizado = pedidoService.updateStatusPedidoLojista(pedidoId, request);
        return ApiResponse.success(pedidoAtualizado);
    }

    @PostMapping("/pedidos/{pedidoId}/aceitar")
    public ApiResponse<Pedido> aceitarPedido(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.aceitarPedido(pedidoId);
        return ApiResponse.success(pedido);
    }

    @PostMapping("/pedidos/{pedidoId}/recusar")
    public ApiResponse<Pedido> recusarPedido(
            @PathVariable Long pedidoId,
            @Valid @RequestBody PedidoRecusarRequest request
    ) {
        Pedido pedido = pedidoService.recusarPedido(pedidoId, request.getJustificativa());
        return ApiResponse.success(pedido);
    }
}