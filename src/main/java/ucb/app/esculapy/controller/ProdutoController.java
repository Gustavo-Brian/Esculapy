package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ProdutoRequest;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.service.CatalogoService; // --- ALTERAÇÃO ---

@RestController
@RequestMapping("/api/admin/catalogo")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ProdutoController {

    private final CatalogoService catalogoService; // --- ALTERAÇÃO ---

    @PostMapping
    public ResponseEntity<Produto> criarProdutoCatalogo(@Valid @RequestBody ProdutoRequest request) {
        Produto produtoCriado = catalogoService.criarProdutoCatalogo(request); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(produtoCriado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> updateProdutoCatalogo(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequest request
    ) {
        Produto produtoAtualizado = catalogoService.updateProdutoCatalogo(id, request); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(produtoAtualizado);
    }

    @PostMapping("/{id}/desativar")
    public ResponseEntity<Produto> desativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = catalogoService.desativarProdutoCatalogo(id); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(produto);
    }

    @PostMapping("/{id}/reativar")
    public ResponseEntity<Produto> reativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = catalogoService.reativarProdutoCatalogo(id); // --- ALTERAÇÃO ---
        return ResponseEntity.ok(produto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProdutoCatalogo(@PathVariable Long id) {
        catalogoService.deleteProdutoCatalogo(id); // --- ALTERAÇÃO ---
        return ResponseEntity.noContent().build();
    }
}