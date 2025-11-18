package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.ApiResponse;
import ucb.app.esculapy.dto.EnderecoRequest;
import ucb.app.esculapy.model.Endereco;
import ucb.app.esculapy.service.EnderecoService;

@RestController
@RequestMapping("/api/enderecos")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
public class EnderecoController {

    private final EnderecoService enderecoService;

    @PostMapping
    public ApiResponse<Endereco> adicionarEndereco(@Valid @RequestBody EnderecoRequest request) {
        Endereco novoEndereco = enderecoService.adicionarEndereco(request);
        return ApiResponse.success(novoEndereco);
    }

    @GetMapping("/meus-enderecos")
    public ApiResponse<Page<Endereco>> getMeusEnderecos(Pageable pageable) {
        Page<Endereco> enderecos = enderecoService.getMeusEnderecos(pageable);
        return ApiResponse.success(enderecos);
    }

    @PutMapping("/{id}")
    public ApiResponse<Endereco> atualizarEndereco(
            @PathVariable Long id,
            @Valid @RequestBody EnderecoRequest request
    ) {
        Endereco endereco = enderecoService.atualizarEndereco(id, request);
        return ApiResponse.success(endereco);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Object> deletarEndereco(@PathVariable Long id) {
        enderecoService.deletarEndereco(id);
        return ApiResponse.success("Endereço deletado com sucesso");
    }
}