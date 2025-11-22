package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.FarmaciaPublicaResponse;
import ucb.app.esculapy.service.FarmaciaService;

/**
 * Controlador REST para endpoints públicos relacionados a farmácias.
 * Permite buscar listagens e detalhes de farmácias acessíveis ao público.
 */
@RestController
@RequestMapping("/api/farmacias")
@RequiredArgsConstructor
public class FarmaciaController {

    private final FarmaciaService farmaciaService;

    /**
     * Lista todas as farmácias disponíveis para consulta pública, com suporte a paginação.
     *
     * @param pageable As informações de paginação (página, tamanho, ordenação).
     * @return Uma resposta de API contendo uma página de objetos {@link FarmaciaPublicaResponse}.
     */
    @GetMapping
    public ApiResponse<Page<FarmaciaPublicaResponse>> listarFarmacias(Pageable pageable) {
        Page<FarmaciaPublicaResponse> farmacias = farmaciaService.listarFarmaciasPublico(pageable);
        return ApiResponse.success(farmacias);
    }

    /**
     * Obtém os detalhes de uma farmácia específica por seu ID para consulta pública.
     *
     * @param id O ID da farmácia.
     * @return Uma resposta de API contendo os detalhes da farmácia em {@link FarmaciaPublicaResponse}.
     */
    @GetMapping("/{id}")
    public ApiResponse<FarmaciaPublicaResponse> getFarmaciaPorId(@PathVariable Long id) {
        FarmaciaPublicaResponse farmacia = farmaciaService.getFarmaciaPublicaPorId(id);
        return ApiResponse.success(farmacia);
    }
}