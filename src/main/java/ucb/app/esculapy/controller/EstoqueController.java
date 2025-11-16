package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.EstoqueResponse;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.service.CatalogoService; // --- ALTERAÇÃO ---

import java.util.List;

@RestController
@RequestMapping("/api/estoque") // Path público
@RequiredArgsConstructor
public class EstoqueController {

    // --- ALTERAÇÃO ---
    // Removemos as duas dependências de serviço e injetamos apenas uma
    private final CatalogoService catalogoService;
    // --- FIM DA ALTERAÇÃO ---

    /**
     * MOVIDO (Era /api/produtos/buscar)
     * Busca estoque por nome do produto.
     */
    @GetMapping("/buscar-por-nome")
    public ResponseEntity<List<EstoqueResponse>> buscarEstoquePorNome(@RequestParam String nome) {
        List<EstoqueResponse> estoques = catalogoService.buscarEstoquePorNomeProduto(nome); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(estoques);
    }

    /**
     * MOVIDO (Era /api/produtos/{id}/ofertas)
     * Busca estoque por ID do catálogo.
     */
    @GetMapping("/buscar-por-catalogo/{catalogoId}")
    public ResponseEntity<List<EstoqueResponse>> getEstoqueParaProduto(@PathVariable Long catalogoId) {
        List<EstoqueResponse> estoques = catalogoService.buscarEstoquePorCatalogoId(catalogoId); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(estoques);
    }

    /**
     * NOVO ENDPOINT (Seu Pedido)
     * Retorna todo o estoque de uma farmácia específica.
     */
    @GetMapping("/farmacia/{farmaciaId}")
    public ResponseEntity<List<EstoqueLojista>> getEstoqueDaFarmacia(@PathVariable Long farmaciaId) {
        List<EstoqueLojista> estoque = catalogoService.getEstoquePublicoDaFarmacia(farmaciaId); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(estoque);
    }

    /**
     * NOVO ENDPOINT (Seu Pedido)
     * Retorna um item de estoque específico.
     */
    @GetMapping("/{estoqueId}")
    public ResponseEntity<EstoqueLojista> getEstoquePorId(@PathVariable Long estoqueId) {
        EstoqueLojista estoque = catalogoService.getEstoquePublicoPorId(estoqueId); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(estoque);
    }
}