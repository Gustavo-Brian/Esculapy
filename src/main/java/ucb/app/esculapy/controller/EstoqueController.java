package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.EstoqueResponse;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.service.EstoqueService;
import ucb.app.esculapy.service.ProdutoService;

import java.util.List;

@RestController
@RequestMapping("/api/estoque") // Path público
@RequiredArgsConstructor
public class EstoqueController {

    private final ProdutoService produtoService; // Para os métodos de busca antigos
    private final EstoqueService estoqueService; // Para os novos métodos de busca

    /**
     * MOVIDO (Era /api/produtos/buscar)
     * Busca estoque por nome do produto.
     */
    @GetMapping("/buscar-por-nome")
    public ResponseEntity<List<EstoqueResponse>> buscarEstoquePorNome(@RequestParam String nome) {
        List<EstoqueResponse> estoques = produtoService.buscarProdutosPorNome(nome);
        return ResponseEntity.ok(estoques);
    }

    /**
     * MOVIDO (Era /api/produtos/{id}/ofertas)
     * Busca estoque por ID do catálogo.
     */
    @GetMapping("/buscar-por-catalogo/{catalogoId}")
    public ResponseEntity<List<EstoqueResponse>> getEstoqueParaProduto(@PathVariable Long catalogoId) {
        List<EstoqueResponse> estoques = produtoService.getOfertasParaProduto(catalogoId);
        return ResponseEntity.ok(estoques);
    }

    /**
     * NOVO ENDPOINT (Seu Pedido)
     * Retorna todo o estoque de uma farmácia específica.
     */
    @GetMapping("/farmacia/{farmaciaId}")
    public ResponseEntity<List<EstoqueLojista>> getEstoqueDaFarmacia(@PathVariable Long farmaciaId) {
        // Você precisará adicionar "getEstoqueDaFarmaciaPublico" no seu EstoqueService
        List<EstoqueLojista> estoque = estoqueService.getEstoqueDaFarmaciaPublico(farmaciaId);
        return ResponseEntity.ok(estoque);
    }

    /**
     * NOVO ENDPOINT (Seu Pedido)
     * Retorna um item de estoque específico.
     */
    @GetMapping("/{estoqueId}")
    public ResponseEntity<EstoqueLojista> getEstoquePorId(@PathVariable Long estoqueId) {
        // Você precisará adicionar "getEstoquePorIdPublico" no seu EstoqueService
        EstoqueLojista estoque = estoqueService.getEstoquePorIdPublico(estoqueId);
        return ResponseEntity.ok(estoque);
    }
}