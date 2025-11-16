package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ProdutoRequest;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.service.ProdutoService;

@RestController
@RequestMapping("/api/admin/catalogo") // MUDANÇA: Path movido para admin
@PreAuthorize("hasRole('ADMIN')")      // MUDANÇA: Permissão movida para a classe toda
@RequiredArgsConstructor
public class ProdutoController {

    private final ProdutoService produtoService;

    // --- ENDPOINTS PÚBLICOS (REMOVIDOS) ---
    // GET /buscar -> movido para EstoqueController
    // GET /{id} -> movido para CatalogoController
    // GET /{id}/ofertas -> movido para EstoqueController


    // --- ENDPOINTS DE ADMIN (Mantidos) ---

    @PostMapping
    public ResponseEntity<Produto> criarProdutoCatalogo(@Valid @RequestBody ProdutoRequest request) {
        Produto produtoCriado = produtoService.criarProdutoCatalogo(request);
        return ResponseEntity.ok(produtoCriado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> updateProdutoCatalogo(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequest request
    ) {
        Produto produtoAtualizado = produtoService.updateProdutoCatalogo(id, request);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @PostMapping("/{id}/desativar")
    public ResponseEntity<Produto> desativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = produtoService.desativarProdutoCatalogo(id);
        return ResponseEntity.ok(produto);
    }

    @PostMapping("/{id}/reativar")
    public ResponseEntity<Produto> reativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = produtoService.reativarProdutoCatalogo(id);
        return ResponseEntity.ok(produto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdutoCatalogo(@PathVariable Long id) {
        produtoService.deleteProdutoCatalogo(id);
        return ResponseEntity.noContent().build();
    }
}