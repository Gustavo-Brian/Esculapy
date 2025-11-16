package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ContaBancariaRequest;
import ucb.app.esculapy.dto.EnderecoRequest;
import ucb.app.esculapy.dto.EstoqueRequest;
import ucb.app.esculapy.dto.FarmaciaInfoRequest;
import ucb.app.esculapy.dto.FarmaceuticoUpdateRequest; // Add
import ucb.app.esculapy.dto.PedidoStatusUpdateRequest;
import ucb.app.esculapy.dto.RegisterFarmaceuticoRequest;
import ucb.app.esculapy.model.ContaBancaria;
import ucb.app.esculapy.model.Endereco;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.model.Farmaceutico;
import ucb.app.esculapy.model.Pedido;
import ucb.app.esculapy.service.CatalogoService;
import ucb.app.esculapy.service.FarmaciaService;
import ucb.app.esculapy.service.PedidoService;

import java.util.List;

@RestController
@RequestMapping("/api/farmacia-admin")
@PreAuthorize("hasRole('ROLE_LOJISTA_ADMIN')")
@RequiredArgsConstructor
public class FarmaciaAdminController {

    private final FarmaciaService farmaciaService;
    private final CatalogoService catalogoService;
    private final PedidoService pedidoService;

    // --- Gerenciamento da Própria Farmácia ---

    @PutMapping("/minha-farmacia/info")
    public ResponseEntity<FarmaciaInfoRequest> updateMinhaFarmaciaInfo(
            @Valid @RequestBody FarmaciaInfoRequest request) {
        FarmaciaInfoRequest info = farmaciaService.updateInfo(request);
        return ResponseEntity.ok(info);
    }

    @PutMapping("/minha-farmacia/endereco")
    public ResponseEntity<Endereco> updateMeuEndereco(
            @Valid @RequestBody EnderecoRequest request) {
        Endereco endereco = farmaciaService.updateEndereco(request);
        return ResponseEntity.ok(endereco);
    }

    @PutMapping("/minha-farmacia/conta-bancaria")
    public ResponseEntity<ContaBancaria> updateMinhaContaBancaria(
            @Valid @RequestBody ContaBancariaRequest request) {
        ContaBancaria conta = farmaciaService.updateContaBancaria(request);
        return ResponseEntity.ok(conta);
    }

    // --- Gerenciamento de Funcionários (EXPANDIDO) ---

    @PostMapping("/farmaceuticos")
    public ResponseEntity<Farmaceutico> adicionarFarmaceutico(@Valid @RequestBody RegisterFarmaceuticoRequest request) {
        Farmaceutico novoFarmaceutico = farmaciaService.adicionarFarmaceutico(request);
        return ResponseEntity.ok(novoFarmaceutico);
    }

    // --- NOVO ENDPOINT ---
    @GetMapping("/farmaceuticos")
    public ResponseEntity<List<Farmaceutico>> listarFarmaceuticos() {
        List<Farmaceutico> farmaceuticos = farmaciaService.listarFarmaceuticos();
        return ResponseEntity.ok(farmaceuticos);
    }

    // --- NOVO ENDPOINT ---
    @PutMapping("/farmaceuticos/{farmaceuticoId}")
    public ResponseEntity<Farmaceutico> atualizarFarmaceutico(
            @PathVariable Long farmaceuticoId,
            @Valid @RequestBody FarmaceuticoUpdateRequest request
    ) {
        Farmaceutico farmaceutico = farmaciaService.atualizarFarmaceutico(farmaceuticoId, request);
        return ResponseEntity.ok(farmaceutico);
    }

    // --- NOVO ENDPOINT ---
    /**
     * Desativa a conta de um farmacêutico (soft-delete).
     * O usuário do farmacêutico não poderá mais logar.
     */
    @PostMapping("/farmaceuticos/{farmaceuticoId}/desativar")
    public ResponseEntity<Void> desativarFarmaceutico(@PathVariable Long farmaceuticoId) {
        farmaciaService.desativarFarmaceutico(farmaceuticoId);
        return ResponseEntity.noContent().build();
    }


    // --- Gerenciamento de Estoque ---

    @PostMapping("/estoque")
    public ResponseEntity<EstoqueLojista> adicionarItemEstoque(@Valid @RequestBody EstoqueRequest request) {
        EstoqueLojista novoItem = catalogoService.adicionarItemEstoque(request);
        return ResponseEntity.ok(novoItem);
    }

    @PutMapping("/estoque/{estoqueId}")
    public ResponseEntity<EstoqueLojista> atualizarEstoque(
            @PathVariable Long estoqueId,
            @Valid @RequestBody EstoqueRequest request) {

        EstoqueLojista itemAtualizado = catalogoService.updateEstoque(estoqueId, request);
        return ResponseEntity.ok(itemAtualizado);
    }

    @DeleteMapping("/estoque/{estoqueId}")
    public ResponseEntity<Void> deletarEstoque(@PathVariable Long estoqueId) {
        catalogoService.deleteEstoque(estoqueId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/estoque")
    public ResponseEntity<List<EstoqueLojista>> getEstoqueDaFarmacia() {
        List<EstoqueLojista> estoque = catalogoService.getEstoquePrivadoDaFarmaciaLogada();
        return ResponseEntity.ok(estoque);
    }


    // --- Gerenciamento de Pedidos ---

    @GetMapping("/pedidos")
    public ResponseEntity<List<Pedido>> getPedidosDaFarmacia() {
        List<Pedido> pedidos = pedidoService.getPedidosDaFarmaciaLogada();
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/pedidos/{pedidoId}/status")
    public ResponseEntity<Pedido> atualizarStatusPedido(
            @PathVariable Long pedidoId,
            @Valid @RequestBody PedidoStatusUpdateRequest request) {

        Pedido pedidoAtualizado = pedidoService.updateStatusPedidoLojista(pedidoId, request);
        return ResponseEntity.ok(pedidoAtualizado);
    }
}