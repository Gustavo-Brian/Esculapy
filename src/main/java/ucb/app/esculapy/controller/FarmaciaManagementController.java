package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ucb.app.esculapy.dto.EstoqueRequest;
import ucb.app.esculapy.dto.RegisterFarmaceuticoRequest; // <--- USADO ABAIXO
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.model.Farmaceutico; // <--- USADO ABAIXO
import ucb.app.esculapy.service.EstoqueService;
import ucb.app.esculapy.service.FarmaciaService;

@RestController
@RequestMapping("/api/farmacia-admin")
@PreAuthorize("hasRole('ROLE_LOJISTA_ADMIN')") // Só o Dono da Farmácia
@RequiredArgsConstructor
public class FarmaciaManagementController {

    private final FarmaciaService farmaciaService;
    private final EstoqueService estoqueService;

    /**
     * POST /api/farmacia-admin/farmaceuticos
     * O Dono da farmácia cadastra um novo funcionário farmacêutico.
     */
    @PostMapping("/farmaceuticos")
    public ResponseEntity<Farmaceutico> adicionarFarmaceutico(@Valid @RequestBody RegisterFarmaceuticoRequest request) {
        // 1. Delega a lógica de criação e linkagem para o FarmaciaService
        Farmaceutico novoFarmaceutico = farmaciaService.adicionarFarmaceutico(request);

        // Retorna o objeto criado (o Farmaceutico)
        return ResponseEntity.ok(novoFarmaceutico);
    }

    /**
     * POST /api/farmacia-admin/estoque - Adiciona um novo item de estoque.
     */
    @PostMapping("/estoque")
    public ResponseEntity<EstoqueLojista> adicionarItemEstoque(@Valid @RequestBody EstoqueRequest request) {
        EstoqueLojista novoItem = estoqueService.adicionarItemEstoque(request);
        return ResponseEntity.ok(novoItem);
    }

    /**
     * PUT /api/farmacia-admin/estoque/{estoqueId} - Atualiza preço e quantidade.
     */
    @PutMapping("/estoque/{estoqueId}")
    public ResponseEntity<EstoqueLojista> atualizarEstoque(
            @PathVariable Long estoqueId,
            @Valid @RequestBody EstoqueRequest request) {

        EstoqueLojista itemAtualizado = estoqueService.updateEstoque(estoqueId, request);
        return ResponseEntity.ok(itemAtualizado);
    }

    /**
     * DELETE /api/farmacia-admin/estoque/{estoqueId} - Remove um item do estoque.
     */
    @DeleteMapping("/estoque/{estoqueId}")
    public ResponseEntity<Void> deletarEstoque(@PathVariable Long estoqueId) {
        estoqueService.deleteEstoque(estoqueId);
        // Retorna 204 No Content, padrão REST para deleção bem-sucedida
        return ResponseEntity.noContent().build();
    }
}