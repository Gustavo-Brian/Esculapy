package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.EstoqueResponse;
import ucb.app.esculapy.dto.ProdutoRequest;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.service.ProdutoService;

import java.util.List;

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    // --- ENDPOINTS PÚBLICOS (Completos) ---
    @GetMapping("/buscar")
    public ResponseEntity<List<EstoqueResponse>> buscarProdutos(@RequestParam String nome) {
        List<EstoqueResponse> ofertas = produtoService.buscarProdutosPorNome(nome);
        return ResponseEntity.ok(ofertas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> getProdutoPorId(@PathVariable Long id) {
        Produto produto = produtoService.getProdutoPorId(id);
        return ResponseEntity.ok(produto);
    }

    @GetMapping("/{id}/ofertas")
    public ResponseEntity<List<EstoqueResponse>> getOfertasParaProduto(@PathVariable Long id) {
        List<EstoqueResponse> ofertas = produtoService.getOfertasParaProduto(id);
        return ResponseEntity.ok(ofertas);
    }


    // --- ENDPOINTS DE ADMIN (Refatorados) ---

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Produto> criarProdutoCatalogo(@Valid @RequestBody ProdutoRequest request) {
        Produto produtoCriado = produtoService.criarProdutoCatalogo(request);
        return ResponseEntity.ok(produtoCriado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Produto> updateProdutoCatalogo(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequest request
    ) {
        Produto produtoAtualizado = produtoService.updateProdutoCatalogo(id, request);
        return ResponseEntity.ok(produtoAtualizado);
    }

    /**
     * (ADMIN) Desativa (soft delete) um produto do CATÁLOGO CENTRAL.
     * O produto para de aparecer nas buscas.
     */
    @PostMapping("/{id}/desativar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Produto> desativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = produtoService.desativarProdutoCatalogo(id);
        return ResponseEntity.ok(produto);
    }

    /**
     * (ADMIN) Reativa um produto desativado no CATÁLOGO CENTRAL.
     */
    @PostMapping("/{id}/reativar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Produto> reativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = produtoService.reativarProdutoCatalogo(id);
        return ResponseEntity.ok(produto);
    }

    /**
     * (ADMIN) Exclui de vez (hard delete) um produto do CATÁLOGO CENTRAL.
     * SÓ FUNCIONA se nenhuma farmácia tiver o item em estoque.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProdutoCatalogo(@PathVariable Long id) {
        produtoService.deleteProdutoCatalogo(id);
        return ResponseEntity.noContent().build();
    }
}