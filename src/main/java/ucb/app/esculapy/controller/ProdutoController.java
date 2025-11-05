package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.dto.EstoqueResponse; // <-- IMPORTAR DTO
import ucb.app.esculapy.dto.ProdutoRequest; // <-- IMPORTAR DTO
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.service.ProdutoService; // <-- IMPORTAR SERVICE

import java.util.List; // <-- IMPORTAR

@RestController
@RequestMapping("/api/produtos")
@RequiredArgsConstructor // Injeta o service
public class ProdutoController {

    // Injeção via construtor
    private final ProdutoService produtoService;

    // --- ENDPOINTS PÚBLICOS ---

    /**
     * Endpoint público para pesquisar produtos no marketplace.
     * GET /api/produtos/buscar?nome=Dipirona
     */
    @GetMapping("/buscar")
    public ResponseEntity<List<EstoqueResponse>> buscarProdutos(@RequestParam String nome) {
        // A lógica foi movida para o service
        List<EstoqueResponse> ofertas = produtoService.buscarProdutosPorNome(nome);
        return ResponseEntity.ok(ofertas);
    }

    /**
     * Endpoint público para ver detalhes de um produto do CATÁLOGO.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Produto> getProdutoPorId(@PathVariable Long id) {
        // A lógica foi movida para o service
        Produto produto = produtoService.getProdutoPorId(id);
        return ResponseEntity.ok(produto);
    }

    /**
     * Endpoint público para ver as ofertas de um produto específico.
     */
    @GetMapping("/{id}/ofertas")
    public ResponseEntity<List<EstoqueResponse>> getOfertasParaProduto(@PathVariable Long id) {
        // A lógica foi movida para o service
        List<EstoqueResponse> ofertas = produtoService.getOfertasParaProduto(id);
        return ResponseEntity.ok(ofertas);
    }

    // --- ENDPOINTS DE ADMIN ---

    /**
     * (ADMIN) Adiciona um novo produto ao CATÁLOGO CENTRAL.
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Produto> criarProdutoCatalogo(@Valid @RequestBody ProdutoRequest request) {
        // A lógica foi movida para o service
        Produto produtoCriado = produtoService.criarProdutoCatalogo(request);
        return ResponseEntity.ok(produtoCriado);
    }
}