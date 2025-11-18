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

    @Transactional(readOnly = true)
    public Page<Produto> getCatalogoCompletoAtivo(Pageable pageable) {
        return produtoRepository.findAllByAtivoTrue(pageable);
    }

    @Transactional(readOnly = true)
    public Produto getProdutoDoCatalogoPorId(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado no catálogo."));
    }

    @Transactional(readOnly = true)
    public Page<EstoqueResponse> buscarEstoquePorNomeProduto(String nome, Pageable pageable) {
        Page<EstoqueLojista> estoques = estoqueLojistaRepository.findByProdutoNomeContendo(nome, pageable);
        return estoques.map(EstoqueResponse::new);
    }

    @Transactional(readOnly = true)
    public Page<EstoqueResponse> buscarEstoquePorCatalogoId(Long catalogoId, Pageable pageable) {
        if (!produtoRepository.existsById(catalogoId)) {
            throw new ResourceNotFoundException("Produto com ID " + catalogoId + " não encontrado no catálogo.");
        }
        Page<EstoqueLojista> estoques = estoqueLojistaRepository.findOfertasByProdutoId(catalogoId, pageable);
        return estoques.map(EstoqueResponse::new);
    }

    @Transactional(readOnly = true)
    public Page<EstoqueLojista> getEstoquePublicoDaFarmacia(Long farmaciaId, Pageable pageable) {
        if (!farmaciaRepository.existsById(farmaciaId)) {
            throw new ResourceNotFoundException("Farmácia com ID " + farmaciaId + " não encontrada.");
        }
        return estoqueLojistaRepository.findPublicoByFarmaciaId(farmaciaId, pageable);
    }

    @Transactional(readOnly = true)
    public EstoqueLojista getEstoquePublicoPorId(Long estoqueId) {
        return estoqueLojistaRepository.findPublicoById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado ou está inativo."));
    }

    // ========================================================================
    // --- Lógica de ADMIN (CRUD Catálogo) ---
    // ========================================================================

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

    @Transactional
    public Produto desativarProdutoCatalogo(Long id) {
        return setProdutoAtivo(id, false);
    }

    @Transactional
    public Produto reativarProdutoCatalogo(Long id) {
        return setProdutoAtivo(id, true);
    }

    @Transactional
    public void deleteProdutoCatalogo(Long id) {
        Produto produto = getProdutoDoCatalogoPorId(id);
        if (estoqueLojistaRepository.existsByProdutoId(id)) {
            throw new ConflictException("Este produto não pode ser excluído permanentemente pois está em uso no estoque de uma ou mais farmácias. Considere desativá-lo.");
        }
        produtoRepository.delete(produto);
    }

    // ========================================================================
    // --- Lógica de LOJISTA_ADMIN (CRUD Estoque) ---
    // ========================================================================

    @Transactional(readOnly = true)
    public Page<EstoqueLojista> getEstoquePrivadoDaFarmaciaLogada(Pageable pageable) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        return estoqueLojistaRepository.findByFarmaciaId(farmacia.getId(), pageable);
    }

    @Transactional
    public EstoqueLojista adicionarItemEstoque(EstoqueRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Produto produto = getProdutoDoCatalogoPorId(request.getProdutoId());

        estoqueLojistaRepository.findByFarmaciaIdAndProdutoId(farmacia.getId(), produto.getId())
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

    @Transactional
    public void deleteEstoque(Long estoqueId) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        EstoqueLojista item = getEstoquePrivadoValidado(estoqueId, farmacia.getId());
        estoqueLojistaRepository.delete(item);
    }

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

    private EstoqueLojista getEstoquePrivadoValidado(Long estoqueId, Long farmaciaId) {
        EstoqueLojista item = estoqueLojistaRepository.findById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado."));

        if (!item.getFarmacia().getId().equals(farmaciaId)) {
            throw new ForbiddenException("Você não tem permissão para alterar o estoque de outra farmácia.");
        }
        return item;
    }

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

    private Produto setProdutoAtivo(Long id, boolean ativo) {
        Produto produto = getProdutoDoCatalogoPorId(id);
        produto.setAtivo(ativo);
        return produtoRepository.save(produto);
    }
}