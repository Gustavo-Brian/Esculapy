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

@RestController
@RequestMapping("/api/farmacias") // Endpoint público
@RequiredArgsConstructor
public class FarmaciaController {

    private final FarmaciaService farmaciaService;

    @GetMapping
    public ApiResponse<Page<FarmaciaPublicaResponse>> listarFarmacias(Pageable pageable) {
        Page<FarmaciaPublicaResponse> farmacias = farmaciaService.listarFarmaciasPublico(pageable);
        return ApiResponse.success(farmacias);
    }

    @GetMapping("/{id}")
    public ApiResponse<FarmaciaPublicaResponse> getFarmaciaPorId(@PathVariable Long id) {
        FarmaciaPublicaResponse farmacia = farmaciaService.getFarmaciaPublicaPorId(id);
        return ApiResponse.success(farmacia);
    }
}