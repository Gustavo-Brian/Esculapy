package ucb.app.esculapy.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.dto.FarmaciaPublicaResponse;
import ucb.app.esculapy.service.FarmaciaService;

import java.util.List;

@RestController
@RequestMapping("/api/farmacias") // Endpoint público
@RequiredArgsConstructor
public class FarmaciaController {

    private final FarmaciaService farmaciaService;

    /**
     * Retorna uma lista de todas as farmácias ATIVAS na plataforma.
     */
    @GetMapping
    public ResponseEntity<List<FarmaciaPublicaResponse>> listarFarmacias() {
        List<FarmaciaPublicaResponse> farmacias = farmaciaService.listarFarmaciasPublico();
        return ResponseEntity.ok(farmacias);
    }

    /**
     * Retorna os dados públicos de uma farmácia específica pelo ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<FarmaciaPublicaResponse> getFarmaciaPorId(@PathVariable Long id) {
        FarmaciaPublicaResponse farmacia = farmaciaService.getFarmaciaPublicaPorId(id);
        return ResponseEntity.ok(farmacia);
    }
}