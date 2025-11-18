package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.ProdutoRequest;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.service.CatalogoService;

@RestController
@RequestMapping("/api/admin/catalogo")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ProdutoController {

    private final CatalogoService catalogoService;

    @PostMapping
    public ApiResponse<Produto> criarProdutoCatalogo(@Valid @RequestBody ProdutoRequest request) {
        Produto produtoCriado = catalogoService.criarProdutoCatalogo(request);
        return ApiResponse.success(produtoCriado);
    }

    @PutMapping("/{id}")
    public ApiResponse<Produto> updateProdutoCatalogo(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequest request
    ) {
        Produto produtoAtualizado = catalogoService.updateProdutoCatalogo(id, request);
        return ApiResponse.success(produtoAtualizado);
    }

    @PostMapping("/{id}/desativar")
    public ApiResponse<Produto> desativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = catalogoService.desativarProdutoCatalogo(id);
        return ApiResponse.success(produto);
    }

    @PostMapping("/{id}/reativar")
    public ApiResponse<Produto> reativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = catalogoService.reativarProdutoCatalogo(id);
        return ApiResponse.success(produto);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deleteProdutoCatalogo(@PathVariable Long id) {
        catalogoService.deleteProdutoCatalogo(id);
        return ApiResponse.success("Produto do catálogo deletado com sucesso");
    }
}