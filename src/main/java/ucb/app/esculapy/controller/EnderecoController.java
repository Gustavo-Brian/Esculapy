package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.EnderecoRequest;
import ucb.app.esculapy.model.Endereco;
import ucb.app.esculapy.service.EnderecoService;

import java.util.List;

@RestController
@RequestMapping("/api/enderecos")
@PreAuthorize("hasRole('CLIENTE')") // Só clientes podem gerenciar endereços
@RequiredArgsConstructor
public class EnderecoController {

    private final EnderecoService enderecoService;

    @PostMapping
    public ResponseEntity<Endereco> adicionarEndereco(@Valid @RequestBody EnderecoRequest request) {
        Endereco novoEndereco = enderecoService.adicionarEndereco(request);
        return ResponseEntity.ok(novoEndereco);
    }

    @GetMapping("/meus-enderecos")
    public ResponseEntity<List<Endereco>> getMeusEnderecos() {
        List<Endereco> enderecos = enderecoService.getMeusEnderecos();
        return ResponseEntity.ok(enderecos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Endereco> atualizarEndereco(
            @PathVariable Long id,
            @Valid @RequestBody EnderecoRequest request
    ) {
        Endereco endereco = enderecoService.atualizarEndereco(id, request);
        return ResponseEntity.ok(endereco);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarEndereco(@PathVariable Long id) {
        enderecoService.deletarEndereco(id);
        return ResponseEntity.noContent().build();
    }
}