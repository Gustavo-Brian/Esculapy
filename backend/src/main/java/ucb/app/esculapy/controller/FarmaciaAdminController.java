package ucb.app.esculapy.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import ucb.app.esculapy.dto.*;
import ucb.app.esculapy.model.*;
import ucb.app.esculapy.service.CatalogoService;
import ucb.app.esculapy.service.FarmaciaService;
import ucb.app.esculapy.service.PedidoService;

/**
 * Controlador REST para o administrador de uma farmácia (lojista).
 * Acesso restrito a usuários com a role 'ROLE_LOJISTA_ADMIN'.
 * Gerencia informações da farmácia, funcionários, estoque e pedidos.
 */
@RestController
@RequestMapping("/api/farmacia-admin")
@PreAuthorize("hasRole('ROLE_LOJISTA_ADMIN')")
@RequiredArgsConstructor
public class FarmaciaAdminController {

    private final FarmaciaService farmaciaService;
    private final CatalogoService catalogoService;
    private final PedidoService pedidoService;

    /**
     * Obtém os detalhes completos da farmácia administrada pelo usuário logado.
     *
     * @return Uma resposta de API contendo o objeto {@link Farmacia} completo.
     */
    @GetMapping("/minha-farmacia")
    public ApiResponse<Farmacia> getMinhaFarmacia() {
        Farmacia farmacia = farmaciaService.getMinhaFarmaciaCompleta();
        return ApiResponse.success(farmacia);
    }

    /**
     * Atualiza as informações básicas da farmácia administrada.
     *
     * @param request O DTO com as informações (nome, cnpj, etc.) a serem atualizadas.
     * @return Uma resposta de API contendo o DTO {@link FarmaciaInfoRequest} atualizado.
     */
    @PutMapping("/minha-farmacia/info")
    public ApiResponse<FarmaciaInfoRequest> updateMinhaFarmaciaInfo(
            @Valid @RequestBody FarmaciaInfoRequest request) {
        FarmaciaInfoRequest info = farmaciaService.updateInfo(request);
        return ApiResponse.success(info);
    }

    /**
     * Atualiza o endereço da farmácia administrada.
     *
     * @param request O DTO com os dados do endereço a serem atualizados.
     * @return Uma resposta de API contendo o objeto {@link Endereco} atualizado.
     */
    @PutMapping("/minha-farmacia/endereco")
    public ApiResponse<Endereco> updateMeuEndereco(
            @Valid @RequestBody EnderecoRequest request) {
        Endereco endereco = farmaciaService.updateEndereco(request);
        return ApiResponse.success(endereco);
    }

    /**
     * Atualiza os dados da conta bancária da farmácia.
     *
     * @param request O DTO com os dados da conta bancária a serem atualizados.
     * @return Uma resposta de API contendo o objeto {@link ContaBancaria} atualizado.
     */
    @PutMapping("/minha-farmacia/conta-bancaria")
    public ApiResponse<ContaBancaria> updateMinhaContaBancaria(
            @Valid @RequestBody ContaBancariaRequest request) {
        ContaBancaria conta = farmaciaService.updateContaBancaria(request);
        return ApiResponse.success(conta);
    }

    /**
     * Adiciona um novo farmacêutico à farmácia.
     *
     * @param request O DTO com os dados de registro do novo farmacêutico.
     * @return Uma resposta de API contendo o novo objeto {@link Farmaceutico} criado.
     */
    @PostMapping("/farmaceuticos")
    public ApiResponse<Farmaceutico> adicionarFarmaceutico(@Valid @RequestBody RegisterFarmaceuticoRequest request) {
        Farmaceutico novoFarmaceutico = farmaciaService.adicionarFarmaceutico(request);
        return ApiResponse.success(novoFarmaceutico);
    }

    /**
     * Lista todos os farmacêuticos associados à farmácia administrada, com suporte a paginação.
     *
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link Farmaceutico}.
     */
    @GetMapping("/farmaceuticos")
    public ApiResponse<Page<Farmaceutico>> listarFarmaceuticos(Pageable pageable) {
        Page<Farmaceutico> farmaceuticos = farmaciaService.listarFarmaceuticos(pageable);
        return ApiResponse.success(farmaceuticos);
    }

    /**
     * Atualiza as informações de um farmacêutico existente.
     *
     * @param farmaceuticoId O ID do farmacêutico a ser atualizado.
     * @param request O DTO com os dados de atualização.
     * @return Uma resposta de API contendo o objeto {@link Farmaceutico} atualizado.
     */
    @PutMapping("/farmaceuticos/{farmaceuticoId}")
    public ApiResponse<Farmaceutico> atualizarFarmaceutico(
            @PathVariable Long farmaceuticoId,
            @Valid @RequestBody FarmaceuticoUpdateRequest request
    ) {
        Farmaceutico farmaceutico = farmaciaService.atualizarFarmaceutico(farmaceuticoId, request);
        return ApiResponse.success(farmaceutico);
    }

    /**
     * Desativa a conta de um farmacêutico, impedindo o acesso.
     *
     * @param farmaceuticoId O ID do farmacêutico a ser desativado.
     * @return Uma resposta de API de sucesso.
     */
    @PostMapping("/farmaceuticos/{farmaceuticoId}/desativar")
    public ApiResponse<Object> desativarFarmaceutico(@PathVariable Long farmaceuticoId) {
        farmaciaService.desativarFarmaceutico(farmaceuticoId);
        return ApiResponse.success("Farmacêutico desativado com sucesso");
    }

    /**
     * Reativa a conta de um farmacêutico desativado.
     *
     * @param farmaceuticoId O ID do farmacêutico a ser reativado.
     * @return Uma resposta de API de sucesso.
     */
    @PostMapping("/farmaceuticos/{farmaceuticoId}/reativar")
    public ApiResponse<Object> reativarFarmaceutico(@PathVariable Long farmaceuticoId) {
        farmaciaService.reativarFarmaceutico(farmaceuticoId);
        return ApiResponse.success("Farmacêutico reativado com sucesso");
    }

    /**
     * Deleta permanentemente a conta de um farmacêutico.
     *
     * @param farmaceuticoId O ID do farmacêutico a ser deletado.
     * @return Uma resposta de API de sucesso.
     */
    @DeleteMapping("/farmaceuticos/{farmaceuticoId}")
    public ApiResponse<Object> deletarFarmaceutico(@PathVariable Long farmaceuticoId) {
        farmaciaService.deletarFarmaceutico(farmaceuticoId);
        return ApiResponse.success("Farmacêutico deletado permanentemente");
    }

    /**
     * Adiciona um novo item ao estoque da farmácia.
     *
     * @param request O DTO contendo os dados do item de estoque.
     * @return Uma resposta de API contendo o novo objeto {@link EstoqueLojista} criado.
     */
    @PostMapping("/estoque")
    public ApiResponse<EstoqueLojista> adicionarItemEstoque(@Valid @RequestBody EstoqueRequest request) {
        EstoqueLojista novoItem = catalogoService.adicionarItemEstoque(request);
        return ApiResponse.success(novoItem);
    }

    /**
     * Lista o estoque privado (completo) da farmácia logada, com suporte a paginação.
     *
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link EstoqueLojista}.
     */
    @GetMapping("/estoque")
    public ApiResponse<Page<EstoqueLojista>> getEstoqueDaFarmacia(Pageable pageable) {
        Page<EstoqueLojista> estoque = catalogoService.getEstoquePrivadoDaFarmaciaLogada(pageable);
        return ApiResponse.success(estoque);
    }

    /**
     * Atualiza um item de estoque existente.
     *
     * @param estoqueId O ID do item de estoque a ser atualizado.
     * @param request O DTO com os dados de atualização.
     * @return Uma resposta de API contendo o objeto {@link EstoqueLojista} atualizado.
     */
    @PutMapping("/estoque/{estoqueId}")
    public ApiResponse<EstoqueLojista> atualizarEstoque(
            @PathVariable Long estoqueId,
            @Valid @RequestBody EstoqueRequest request) {
        EstoqueLojista itemAtualizado = catalogoService.updateEstoque(estoqueId, request);
        return ApiResponse.success(itemAtualizado);
    }

    /**
     * Deleta um item de estoque.
     *
     * @param estoqueId O ID do item de estoque a ser deletado.
     * @return Uma resposta de API de sucesso.
     */
    @DeleteMapping("/estoque/{estoqueId}")
    public ApiResponse<Object> deletarEstoque(@PathVariable Long estoqueId) {
        catalogoService.deleteEstoque(estoqueId);
        return ApiResponse.success("Item de estoque deletado com sucesso");
    }

    /**
     * Ativa um item de estoque para que ele fique visível ao público.
     *
     * @param estoqueId O ID do item de estoque a ser ativado.
     * @return Uma resposta de API contendo o objeto {@link EstoqueLojista} atualizado.
     */
    @PostMapping("/estoque/{estoqueId}/ativar")
    public ApiResponse<EstoqueLojista> ativarEstoque(@PathVariable Long estoqueId) {
        EstoqueLojista item = catalogoService.setEstoqueAtivo(estoqueId, true);
        return ApiResponse.success(item);
    }

    /**
     * Desativa um item de estoque, removendo-o da visualização pública.
     *
     * @param estoqueId O ID do item de estoque a ser desativado.
     * @return Uma resposta de API contendo o objeto {@link EstoqueLojista} atualizado.
     */
    @PostMapping("/estoque/{estoqueId}/desativar")
    public ApiResponse<EstoqueLojista> desativarEstoque(@PathVariable Long estoqueId) {
        EstoqueLojista item = catalogoService.setEstoqueAtivo(estoqueId, false);
        return ApiResponse.success(item);
    }

    /**
     * Lista os pedidos recebidos pela farmácia logada, com suporte a paginação.
     *
     * @param pageable As informações de paginação.
     * @return Uma resposta de API contendo uma página de objetos {@link Pedido}.
     */
    @GetMapping("/pedidos")
    public ApiResponse<Page<Pedido>> getPedidosDaFarmacia(Pageable pageable) {
        Page<Pedido> pedidos = pedidoService.getPedidosDaFarmaciaLogada(pageable);
        return ApiResponse.success(pedidos);
    }

    /**
     * Obtém os detalhes de um pedido específico para o lojista.
     *
     * @param pedidoId O ID do pedido.
     * @return Uma resposta de API contendo o objeto {@link Pedido}.
     */
    @GetMapping("/pedidos/{pedidoId}")
    public ApiResponse<Pedido> getPedidoDetalhesLojista(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.getPedidoDetalhesLojista(pedidoId);
        return ApiResponse.success(pedido);
    }

    /**
     * Atualiza o status de um pedido (ex: Em Preparação, Em Entrega).
     *
     * @param pedidoId O ID do pedido a ser atualizado.
     * @param request O DTO com o novo status.
     * @return Uma resposta de API contendo o objeto {@link Pedido} atualizado.
     */
    @PutMapping("/pedidos/{pedidoId}/status")
    public ApiResponse<Pedido> atualizarStatusPedido(
            @PathVariable Long pedidoId,
            @Valid @RequestBody PedidoStatusUpdateRequest request) {
        Pedido pedidoAtualizado = pedidoService.updateStatusPedidoLojista(pedidoId, request);
        return ApiResponse.success(pedidoAtualizado);
    }

    /**
     * Aceita um pedido pendente.
     *
     * @param pedidoId O ID do pedido a ser aceito.
     * @return Uma resposta de API contendo o objeto {@link Pedido} atualizado.
     */
    @PostMapping("/pedidos/{pedidoId}/aceitar")
    public ApiResponse<Pedido> aceitarPedido(@PathVariable Long pedidoId) {
        Pedido pedido = pedidoService.aceitarPedido(pedidoId);
        return ApiResponse.success(pedido);
    }

    /**
     * Recusa um pedido pendente, fornecendo uma justificativa.
     *
     * @param pedidoId O ID do pedido a ser recusado.
     * @param request O DTO contendo a justificativa da recusa.
     * @return Uma resposta de API contendo o objeto {@link Pedido} atualizado.
     */
    @PostMapping("/pedidos/{pedidoId}/recusar")
    public ApiResponse<Pedido> recusarPedido(
            @PathVariable Long pedidoId,
            @Valid @RequestBody PedidoRecusarRequest request
    ) {
        Pedido pedido = pedidoService.recusarPedido(pedidoId, request.getJustificativa());
        return ApiResponse.success(pedido);
    }
}