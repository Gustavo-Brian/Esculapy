package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.service.ProdutoService;

import java.util.List;

@RestController
@RequestMapping("/api/catalogo") // Path público
@RequiredArgsConstructor
public class CatalogoController {

    private final ProdutoService produtoService;

    /**
     * NOVO ENDPOINT (Seu Pedido)
     * Retorna uma lista de todos os produtos ativos do catálogo central.
     */
    @GetMapping
    public ResponseEntity<List<Produto>> getCatalogoCompleto() {
        // Você precisará adicionar o método "findAllAtivos" no seu ProdutoService
        List<Produto> catalogo = produtoService.findAllAtivos();
        return ResponseEntity.ok(catalogo);
    }

    /**
     * MOVIDO (Era /api/produtos/{id})
     * Retorna um produto específico do catálogo central.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Produto> getProdutoDoCatalogoPorId(@PathVariable Long id) {
        Produto produto = produtoService.getProdutoPorId(id);
        return ResponseEntity.ok(produto);
    }
}