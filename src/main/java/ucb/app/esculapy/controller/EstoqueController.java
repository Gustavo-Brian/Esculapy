package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.EstoqueResponse;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.service.CatalogoService;

/**
 * Controlador REST para endpoints públicos relacionados a itens de estoque.
 * Permite buscar o estoque disponível nas farmácias.
 */
@RestController
@RequestMapping("/api/estoque")
@RequiredArgsConstructor
public class EstoqueController {

    private final CatalogoService catalogoService;

    /**
     * Busca itens de estoque pelo nome do produto, com suporte a paginação.
     *
     * @param nome O nome do produto a ser buscado.
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link EstoqueResponse}.
     */
    @GetMapping("/buscar-por-nome")
    public ApiResponse<Page<EstoqueResponse>> buscarEstoquePorNome(@RequestParam String nome, Pageable pageable) {
        Page<EstoqueResponse> estoques = catalogoService.buscarEstoquePorNomeProduto(nome, pageable);
        return ApiResponse.success(estoques);
    }

    /**
     * Obtém todos os itens de estoque relacionados a um produto específico do catálogo, com suporte a paginação.
     *
     * @param catalogoId O ID do produto no catálogo.
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link EstoqueResponse}.
     */
    @GetMapping("/buscar-por-catalogo/{catalogoId}")
    public ApiResponse<Page<EstoqueResponse>> getEstoqueParaProduto(@PathVariable Long catalogoId, Pageable pageable) {
        Page<EstoqueResponse> estoques = catalogoService.buscarEstoquePorCatalogoId(catalogoId, pageable);
        return ApiResponse.success(estoques);
    }

    /**
     * Obtém o estoque disponível de uma farmácia específica, acessível publicamente, com suporte a paginação.
     *
     * @param farmaciaId O ID da farmácia.
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link EstoqueLojista}.
     */
    @GetMapping("/farmacia/{farmaciaId}")
    public ApiResponse<Page<EstoqueLojista>> getEstoqueDaFarmacia(@PathVariable Long farmaciaId, Pageable pageable) {
        Page<EstoqueLojista> estoque = catalogoService.getEstoquePublicoDaFarmacia(farmaciaId, pageable);
        return ApiResponse.success(estoque);
    }

    /**
     * Obtém os detalhes de um item de estoque específico por seu ID, acessível publicamente.
     *
     * @param estoqueId O ID do item de estoque.
     * @return Uma resposta de API contendo o objeto {@link EstoqueLojista}.
     */
    @GetMapping("/{estoqueId}")
    public ApiResponse<EstoqueLojista> getEstoquePorId(@PathVariable Long estoqueId) {
        EstoqueLojista estoque = catalogoService.getEstoquePublicoPorId(estoqueId);
        return ApiResponse.success(estoque);
    }
}