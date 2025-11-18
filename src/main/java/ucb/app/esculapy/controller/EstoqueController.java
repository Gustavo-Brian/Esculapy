package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.EstoqueResponse;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.service.CatalogoService;

@RestController
@RequestMapping("/api/estoque") // Path público
@RequiredArgsConstructor
public class EstoqueController {

    private final CatalogoService catalogoService;

    @GetMapping("/buscar-por-nome")
    public ApiResponse<Page<EstoqueResponse>> buscarEstoquePorNome(@RequestParam String nome, Pageable pageable) {
        Page<EstoqueResponse> estoques = catalogoService.buscarEstoquePorNomeProduto(nome, pageable);
        return ApiResponse.success(estoques);
    }

    @GetMapping("/buscar-por-catalogo/{catalogoId}")
    public ApiResponse<Page<EstoqueResponse>> getEstoqueParaProduto(@PathVariable Long catalogoId, Pageable pageable) {
        Page<EstoqueResponse> estoques = catalogoService.buscarEstoquePorCatalogoId(catalogoId, pageable);
        return ApiResponse.success(estoques);
    }

    @GetMapping("/farmacia/{farmaciaId}")
    public ApiResponse<Page<EstoqueLojista>> getEstoqueDaFarmacia(@PathVariable Long farmaciaId, Pageable pageable) {
        Page<EstoqueLojista> estoque = catalogoService.getEstoquePublicoDaFarmacia(farmaciaId, pageable);
        return ApiResponse.success(estoque);
    }

    @GetMapping("/{estoqueId}")
    public ApiResponse<EstoqueLojista> getEstoquePorId(@PathVariable Long estoqueId) {
        EstoqueLojista estoque = catalogoService.getEstoquePublicoPorId(estoqueId);
        return ApiResponse.success(estoque);
    }
}