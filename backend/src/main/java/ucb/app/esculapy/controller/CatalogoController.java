package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.service.CatalogoService;

/**
 * Controlador REST para endpoints públicos relacionados ao catálogo de produtos.
 * Permite a consulta de produtos disponíveis na plataforma.
 */
@RestController
@RequestMapping("/api/catalogo")
@RequiredArgsConstructor
public class CatalogoController {

    private final CatalogoService catalogoService;

    /**
     * Obtém o catálogo completo de produtos ativos, com suporte a paginação.
     *
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link Produto}.
     */
    @GetMapping
    public ApiResponse<Page<Produto>> getCatalogoCompleto(Pageable pageable) {
        Page<Produto> catalogo = catalogoService.getCatalogoCompletoAtivo(pageable);
        return ApiResponse.success(catalogo);
    }

    /**
     * Obtém os detalhes de um produto específico do catálogo por seu ID.
     *
     * @param id O ID do produto.
     * @return Uma resposta de API contendo o objeto {@link Produto}.
     */
    @GetMapping("/{id}")
    public ApiResponse<Produto> getProdutoDoCatalogoPorId(@PathVariable Long id) {
        Produto produto = catalogoService.getProdutoDoCatalogoPorId(id);
        return ApiResponse.success(produto);
    }
}