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

/**
 * Controlador REST para gerenciamento de endereços do usuário autenticado.
 * Acesso restrito a usuários com a role 'CLIENTE'.
 */
@RestController
@RequestMapping("/api/enderecos")
@PreAuthorize("hasRole('CLIENTE')")
@RequiredArgsConstructor
public class EnderecoController {

    private final EnderecoService enderecoService;

    /**
     * Adiciona um novo endereço para o usuário autenticado.
     *
     * @param request O DTO contendo os dados do novo endereço.
     * @return Uma resposta de API contendo o novo {@link Endereco} criado.
     */
    @PostMapping
    public ApiResponse<Endereco> adicionarEndereco(@Valid @RequestBody EnderecoRequest request) {
        Endereco novoEndereco = enderecoService.adicionarEndereco(request);
        return ApiResponse.success(novoEndereco);
    }

    /**
     * Lista todos os endereços do usuário autenticado, com suporte a paginação.
     *
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link Endereco}.
     */
    @GetMapping("/meus-enderecos")
    public ApiResponse<Page<Endereco>> getMeusEnderecos(Pageable pageable) {
        Page<Endereco> enderecos = enderecoService.getMeusEnderecos(pageable);
        return ApiResponse.success(enderecos);
    }

    /**
     * Atualiza um endereço existente do usuário autenticado.
     *
     * @param id O ID do endereço a ser atualizado.
     * @param request O DTO contendo os novos dados do endereço.
     * @return Uma resposta de API contendo o {@link Endereco} atualizado.
     */
    @PutMapping("/{id}")
    public ApiResponse<Endereco> atualizarEndereco(
            @PathVariable Long id,
            @Valid @RequestBody EnderecoRequest request
    ) {
        Endereco endereco = enderecoService.atualizarEndereco(id, request);
        return ApiResponse.success(endereco);
    }

    /**
     * Deleta um endereço do usuário autenticado.
     *
     * @param id O ID do endereço a ser deletado.
     * @return Uma resposta de API de sucesso.
     */
    @DeleteMapping("/{id}")
    public ApiResponse<Object> deletarEndereco(@PathVariable Long id) {
        enderecoService.deletarEndereco(id);
        return ApiResponse.success("Endereço deletado com sucesso");
    }
}