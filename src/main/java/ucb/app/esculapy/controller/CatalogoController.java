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

@RestController
@RequestMapping("/api/catalogo") // Path público
@RequiredArgsConstructor
public class CatalogoController {

    private final CatalogoService catalogoService;

    @GetMapping
    public ApiResponse<Page<Produto>> getCatalogoCompleto(Pageable pageable) {
        Page<Produto> catalogo = catalogoService.getCatalogoCompletoAtivo(pageable);
        return ApiResponse.success(catalogo);
    }

    @GetMapping("/{id}")
    public ApiResponse<Produto> getProdutoDoCatalogoPorId(@PathVariable Long id) {
        Produto produto = catalogoService.getProdutoDoCatalogoPorId(id);
        return ApiResponse.success(produto);
    }
}