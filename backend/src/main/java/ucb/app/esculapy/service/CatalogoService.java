package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.EstoqueRequest;
import ucb.app.esculapy.dto.EstoqueResponse;
import ucb.app.esculapy.dto.ProdutoRequest;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.FarmaciaRepository;
import ucb.app.esculapy.repository.ProdutoRepository;

/**
 * Serviço responsável por toda a lógica de Catálogo Mestre (Admin) e Estoque (Lojista/Público).
 */
@Service
@RequiredArgsConstructor
public class CatalogoService {

    private final ProdutoRepository produtoRepository;
    private final EstoqueLojistaRepository estoqueLojistaRepository;
    private final FarmaciaRepository farmaciaRepository;
    private final AuthenticationService authenticationService;

    // ========================================================================
    // --- Lógica PÚBLICA (Paginada) ---
    // ========================================================================

    /**
     * Obtém o catálogo mestre de produtos ativos para visualização pública.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de {@link Produto} ativos.
     */
    @Transactional(readOnly = true)
    public Page<Produto> getCatalogoCompletoAtivo(Pageable pageable) {
        return produtoRepository.findAllByAtivoTrue(pageable);
    }

    /**
     * Obtém os detalhes de um produto do catálogo por ID.
     *
     * @param id O ID do produto.
     * @return O objeto {@link Produto}.
     * @throws ResourceNotFoundException Se o produto não for encontrado.
     */
    @Transactional(readOnly = true)
    public Produto getProdutoDoCatalogoPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado no catálogo."));
    }

    /**
     * Busca o estoque disponível em todas as farmácias por nome do produto.
     *
     * @param nome O nome do produto.
     * @param pageable As informações de paginação.
     * @return Uma página de {@link EstoqueResponse}.
     */
    @Transactional(readOnly = true)
    public Page<EstoqueResponse> buscarEstoquePorNomeProduto(String nome, Pageable pageable) {
        Page<EstoqueLojista> estoques = estoqueLojistaRepository.findByProdutoNomeContendo(nome, pageable);
        return estoques.map(EstoqueResponse::new);
    }

    /**
     * Busca todas as ofertas de estoque para um produto específico no catálogo.
     *
     * @param catalogoId O ID do produto no catálogo.
     * @param pageable As informações de paginação.
     * @return Uma página de {@link EstoqueResponse}.
     * @throws ResourceNotFoundException Se o produto não for encontrado no catálogo.
     */
    @Transactional(readOnly = true)
    public Page<EstoqueResponse> buscarEstoquePorCatalogoId(Long catalogoId, Pageable pageable) {
        if (!produtoRepository.existsById(catalogoId)) {
            throw new ResourceNotFoundException("Produto com ID " + catalogoId + " não encontrado no catálogo.");
        }
        Page<EstoqueLojista> estoques = estoqueLojistaRepository.findOfertasByProdutoId(catalogoId, pageable);
        return estoques.map(EstoqueResponse::new);
    }

    /**
     * Obtém o estoque público (ativo) de uma farmácia específica.
     *
     * @param farmaciaId O ID da farmácia.
     * @param pageable As informações de paginação.
     * @return Uma página de {@link EstoqueLojista}.
     * @throws ResourceNotFoundException Se a farmácia não for encontrada.
     */
    @Transactional(readOnly = true)
    public Page<EstoqueLojista> getEstoquePublicoDaFarmacia(Long farmaciaId, Pageable pageable) {
        if (!farmaciaRepository.existsById(farmaciaId)) {
            throw new ResourceNotFoundException("Farmácia com ID " + farmaciaId + " não encontrada.");
        }
        return estoqueLojistaRepository.findPublicoByFarmaciaId(farmaciaId, pageable);
    }

    /**
     * Obtém um item de estoque específico, garantindo que ele esteja ativo (para o público).
     *
     * @param estoqueId O ID do item de estoque.
     * @return O objeto {@link EstoqueLojista}.
     * @throws ResourceNotFoundException Se o item não for encontrado ou estiver inativo.
     */
    @Transactional(readOnly = true)
    public EstoqueLojista getEstoquePublicoPorId(Long estoqueId) {
        return estoqueLojistaRepository.findPublicoById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado ou está inativo."));
    }

    // ========================================================================
    // --- Lógica de ADMIN (CRUD Catálogo) ---
    // ========================================================================

    /**
     * Cria um novo produto no catálogo mestre.
     *
     * @param request O DTO {@link ProdutoRequest}.
     * @return O objeto {@link Produto} criado.
     * @throws ConflictException Se o EAN ou Código de Registro MS já estiverem em uso.
     */
    @Transactional
    public Produto criarProdutoCatalogo(ProdutoRequest request) {
        if (produtoRepository.findByEan(request.getEan()).isPresent()) {
            throw new ConflictException("EAN (Código de Barras) '" + request.getEan() + "' já cadastrado.");
        }
        if (produtoRepository.findByCodigoRegistroMS(request.getCodigoRegistroMS()).isPresent()) {
            throw new ConflictException("Código de Registro MS '" + request.getCodigoRegistroMS() + "' já cadastrado.");
        }

        Produto produto = new Produto();
        produto.setAtivo(true);
        return mapDtoToProduto(produto, request);
    }

    /**
     * Atualiza um produto existente no catálogo mestre.
     *
     * @param id O ID do produto.
     * @param request O DTO {@link ProdutoRequest}.
     * @return O objeto {@link Produto} atualizado.
     * @throws ResourceNotFoundException Se o produto não for encontrado.
     * @throws ConflictException Se o EAN ou Código de Registro MS pertencerem a outro produto.
     */
    @Transactional
    public Produto updateProdutoCatalogo(Long id, ProdutoRequest request) {
        Produto produto = getProdutoDoCatalogoPorId(id);

        produtoRepository.findByEan(request.getEan()).ifPresent(p -> {
            if (!p.getId().equals(id)) {
                throw new ConflictException("EAN (Código de Barras) '" + request.getEan() + "' já pertence a outro produto.");
            }
        });
        produtoRepository.findByCodigoRegistroMS(request.getCodigoRegistroMS()).ifPresent(p -> {
            if (!p.getId().equals(id)) {
                throw new ConflictException("Código de Registro MS '" + request.getCodigoRegistroMS() + "' já pertence a outro produto.");
            }
        });

        return mapDtoToProduto(produto, request);
    }

    /**
     * Desativa um produto no catálogo.
     *
     * @param id O ID do produto.
     * @return O objeto {@link Produto} desativado.
     * @throws ResourceNotFoundException Se o produto não for encontrado.
     */
    @Transactional
    public Produto desativarProdutoCatalogo(Long id) {
        return setProdutoAtivo(id, false);
    }

    /**
     * Reativa um produto no catálogo.
     *
     * @param id O ID do produto.
     * @return O objeto {@link Produto} reativado.
     * @throws ResourceNotFoundException Se o produto não for encontrado.
     */
    @Transactional
    public Produto reativarProdutoCatalogo(Long id) {
        return setProdutoAtivo(id, true);
    }

    /**
     * Deleta permanentemente um produto do catálogo.
     *
     * @param id O ID do produto.
     * @throws ResourceNotFoundException Se o produto não for encontrado.
     * @throws ConflictException Se o produto estiver em uso no estoque de alguma farmácia.
     */
    @Transactional
    public void deleteProdutoCatalogo(Long id) {
        Produto produto = getProdutoDoCatalogoPorId(id);
        if (estoqueLojistaRepository.existsByProduto_Id(id)) {
            throw new ConflictException("Este produto não pode ser excluído permanentemente pois está em uso no estoque de uma ou mais farmácias. Considere desativá-lo.");
        }
        produtoRepository.delete(produto);
    }

    // ========================================================================
    // --- Lógica de LOJISTA_ADMIN (CRUD Estoque) ---
    // ========================================================================

    /**
     * Lista o estoque privado (completo, ativo/inativo) da farmácia do lojista logado.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de {@link EstoqueLojista}.
     */
    @Transactional(readOnly = true)
    public Page<EstoqueLojista> getEstoquePrivadoDaFarmaciaLogada(Pageable pageable) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        return estoqueLojistaRepository.findByFarmaciaId(farmacia.getId(), pageable);
    }

    /**
     * Adiciona um novo item de estoque para a farmácia logada.
     *
     * @param request O DTO {@link EstoqueRequest}.
     * @return O objeto {@link EstoqueLojista} criado.
     * @throws ResourceNotFoundException Se o produto não for encontrado.
     * @throws ConflictException Se o produto já existir no estoque da farmácia.
     */
    @Transactional
    public EstoqueLojista adicionarItemEstoque(EstoqueRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Produto produto = getProdutoDoCatalogoPorId(request.getProdutoId());

        estoqueLojistaRepository.findByFarmaciaIdAndProduto_Id(farmacia.getId(), produto.getId())
                .ifPresent(estoque -> {
                    throw new ConflictException("Este produto já existe no seu estoque (ID: " + estoque.getId() + "). Use a rota de atualização (PUT) se quiser alterar preço ou quantidade.");
                });

        EstoqueLojista novoItem = new EstoqueLojista();
        novoItem.setFarmacia(farmacia);
        novoItem.setProduto(produto);
        novoItem.setPreco(request.getPreco());
        novoItem.setQuantidade(request.getQuantidade());

        return estoqueLojistaRepository.save(novoItem);
    }

    /**
     * Atualiza o preço e/ou quantidade de um item de estoque existente.
     *
     * @param estoqueId O ID do item de estoque.
     * @param request O DTO {@link EstoqueRequest}.
     * @return O objeto {@link EstoqueLojista} atualizado.
     * @throws ResourceNotFoundException Se o item não for encontrado.
     * @throws ForbiddenException Se o item não pertencer à farmácia logada.
     * @throws ConflictException Se houver tentativa de mudar o produto associado.
     */
    @Transactional
    public EstoqueLojista updateEstoque(Long estoqueId, EstoqueRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        EstoqueLojista item = getEstoquePrivadoValidado(estoqueId, farmacia.getId());

        if (!item.getProduto().getId().equals(request.getProdutoId())) {
            throw new ConflictException("Não é permitido alterar o ProdutoId de um item de estoque. Crie um novo item.");
        }

        item.setPreco(request.getPreco());
        item.setQuantidade(request.getQuantidade());

        return estoqueLojistaRepository.save(item);
    }

    /**
     * Deleta um item de estoque.
     *
     * @param estoqueId O ID do item de estoque.
     * @throws ResourceNotFoundException Se o item não for encontrado.
     * @throws ForbiddenException Se o item não pertencer à farmácia logada.
     */
    @Transactional
    public void deleteEstoque(Long estoqueId) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        EstoqueLojista item = getEstoquePrivadoValidado(estoqueId, farmacia.getId());
        estoqueLojistaRepository.delete(item);
    }

    /**
     * Ativa ou desativa um item de estoque para visibilidade pública.
     *
     * @param estoqueId O ID do item de estoque.
     * @param ativo O novo estado de ativação.
     * @return O objeto {@link EstoqueLojista} atualizado.
     * @throws ResourceNotFoundException Se o item não for encontrado.
     * @throws ForbiddenException Se o item não pertencer à farmácia logada.
     */
    @Transactional
    public EstoqueLojista setEstoqueAtivo(Long estoqueId, boolean ativo) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        EstoqueLojista item = getEstoquePrivadoValidado(estoqueId, farmacia.getId());
        item.setAtivo(ativo);
        return estoqueLojistaRepository.save(item);
    }

    // ========================================================================
    // --- Métodos Auxiliares Privados ---
    // ========================================================================

    /**
     * Busca um item de estoque e valida se ele pertence à farmácia especificada.
     *
     * @param estoqueId O ID do item de estoque.
     * @param farmaciaId O ID da farmácia esperada.
     * @return O objeto {@link EstoqueLojista}.
     * @throws ResourceNotFoundException Se o item de estoque não for encontrado.
     * @throws ForbiddenException Se o item não pertencer à farmácia.
     */
    private EstoqueLojista getEstoquePrivadoValidado(Long estoqueId, Long farmaciaId) {
        EstoqueLojista item = estoqueLojistaRepository.findById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado."));

        if (!item.getFarmacia().getId().equals(farmaciaId)) {
            throw new ForbiddenException("Você não tem permissão para alterar o estoque de outra farmácia.");
        }
        return item;
    }

    /**
     * Mapeia os dados de um {@link ProdutoRequest} para um objeto {@link Produto} e o salva.
     *
     * @param produto O objeto Produto de destino.
     * @param request O DTO de requisição.
     * @return O objeto {@link Produto} salvo.
     */
    private Produto mapDtoToProduto(Produto produto, ProdutoRequest request) {
        produto.setNome(request.getNome());
        produto.setEan(request.getEan());
        produto.setPrincipioAtivo(request.getPrincipioAtivo());
        produto.setLaboratorio(request.getLaboratorio());
        produto.setDescricao(request.getDescricao());
        produto.setCodigoRegistroMS(request.getCodigoRegistroMS());
        produto.setBulaUrl(request.getBulaUrl());
        produto.setTipoProduto(request.getTipoProduto());
        produto.setTipoReceita(request.getTipoReceita());
        return produtoRepository.save(produto);
    }

    /**
     * Altera o status de ativação (ativo) de um produto no catálogo.
     *
     * @param id O ID do produto.
     * @param ativo O novo estado.
     * @return O objeto {@link Produto} salvo.
     * @throws ResourceNotFoundException Se o produto não for encontrado.
     */
    private Produto setProdutoAtivo(Long id, boolean ativo) {
        Produto produto = getProdutoDoCatalogoPorId(id);
        produto.setAtivo(ativo);
        return produtoRepository.save(produto);
    }
}