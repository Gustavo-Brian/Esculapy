package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.ProdutoRequest;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.service.CatalogoService;

/**
 * Controlador REST para o gerenciamento de produtos no catálogo mestre.
 * Acesso restrito a usuários com a role 'ADMIN'.
 * Permite criar, atualizar e gerenciar o status dos produtos no catálogo.
 */
@RestController
@RequestMapping("/api/admin/catalogo")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class ProdutoController {

    private final CatalogoService catalogoService;

    /**
     * Cria um novo produto no catálogo mestre.
     *
     * @param request O DTO contendo os dados do novo produto.
     * @return Uma resposta de API contendo o objeto {@link Produto} criado.
     */
    @PostMapping
    public ApiResponse<Produto> criarProdutoCatalogo(@Valid @RequestBody ProdutoRequest request) {
        Produto produtoCriado = catalogoService.criarProdutoCatalogo(request);
        return ApiResponse.success(produtoCriado);
    }

    /**
     * Atualiza um produto existente no catálogo mestre.
     *
     * @param id O ID do produto a ser atualizado.
     * @param request O DTO contendo os novos dados do produto.
     * @return Uma resposta de API contendo o objeto {@link Produto} atualizado.
     */
    @PutMapping("/{id}")
    public ApiResponse<Produto> updateProdutoCatalogo(
            @PathVariable Long id,
            @Valid @RequestBody ProdutoRequest request
    ) {
        Produto produtoAtualizado = catalogoService.updateProdutoCatalogo(id, request);
        return ApiResponse.success(produtoAtualizado);
    }

    /**
     * Desativa um produto no catálogo mestre, impedindo-o de ser listado no catálogo público.
     *
     * @param id O ID do produto a ser desativado.
     * @return Uma resposta de API contendo o objeto {@link Produto} atualizado.
     */
    @PostMapping("/{id}/desativar")
    public ApiResponse<Produto> desativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = catalogoService.desativarProdutoCatalogo(id);
        return ApiResponse.success(produto);
    }

    /**
     * Reativa um produto no catálogo mestre, permitindo que ele seja listado novamente no catálogo público.
     *
     * @param id O ID do produto a ser reativado.
     * @return Uma resposta de API contendo o objeto {@link Produto} atualizado.
     */
    @PostMapping("/{id}/reativar")
    public ApiResponse<Produto> reativarProdutoCatalogo(@PathVariable Long id) {
        Produto produto = catalogoService.reativarProdutoCatalogo(id);
        return ApiResponse.success(produto);
    }

    /**
     * Deleta permanentemente um produto do catálogo mestre.
     *
     * @param id O ID do produto a ser deletado.
     * @return Uma resposta de API de sucesso.
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Object> deleteProdutoCatalogo(@PathVariable Long id) {
        catalogoService.deleteProdutoCatalogo(id);
        return ApiResponse.success("Produto do catálogo deletado com sucesso");
    }
}