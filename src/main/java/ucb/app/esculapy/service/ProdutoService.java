package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.EstoqueResponse;
import ucb.app.esculapy.dto.ProdutoRequest;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.ProdutoRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final EstoqueLojistaRepository estoqueLojistaRepository; // Já estava injetado

    // --- Lógica Pública (Completa) ---
    @Transactional(readOnly = true)
    public List<EstoqueResponse> buscarProdutosPorNome(String nome) {
        // 1. Usa a query otimizada do repositório
        List<EstoqueLojista> estoques = estoqueLojistaRepository.findByProdutoNomeContendo(nome);

        // 2. Mapeia a lista de Entidades para a lista de DTOs
        return estoques.stream()
                .map(EstoqueResponse::new) // Usa o construtor que criamos no DTO
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Produto getProdutoPorId(Long id) {
        // 1. Busca o produto no catálogo central
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado no catálogo."));
    }

    @Transactional(readOnly = true)
    public List<EstoqueResponse> getOfertasParaProduto(Long id) {
        // 1. Valida se o produto existe
        if (!produtoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Produto com ID " + id + " não encontrado no catálogo.");
        }

        // 2. Busca as ofertas usando a query otimizada
        List<EstoqueLojista> estoques = estoqueLojistaRepository.findOfertasByProdutoId(id);

        // 3. Mapeia para DTOs
        return estoques.stream()
                .map(EstoqueResponse::new)
                .collect(Collectors.toList());
    }

    // --- Lógica de Admin (Refatorada e Completa) ---

    @Transactional
    public Produto criarProdutoCatalogo(ProdutoRequest request) {
        // 1. Validar duplicatas
        if (produtoRepository.findByEan(request.getEan()).isPresent()) {
            throw new ConflictException("EAN (Código de Barras) '" + request.getEan() + "' já cadastrado.");
        }
        if (produtoRepository.findByCodigoRegistroMS(request.getCodigoRegistroMS()).isPresent()) {
            throw new ConflictException("Código de Registro MS '" + request.getCodigoRegistroMS() + "' já cadastrado.");
        }

        Produto produto = new Produto();
        produto.setAtivo(true); // Garante que novos produtos estejam ativos
        return mapDtoToProduto(produto, request);
    }

    @Transactional
    public Produto updateProdutoCatalogo(Long id, ProdutoRequest request) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado."));

        // Validação de duplicidade (só se o valor mudou E pertence a outro produto)
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
     * (ADMIN) Desativa (soft delete) um produto do catálogo.
     */
    @Transactional
    public Produto desativarProdutoCatalogo(Long id) {
        return setProdutoAtivo(id, false);
    }

    /**
     * (ADMIN) Reativa um produto do catálogo.
     */
    @Transactional
    public Produto reativarProdutoCatalogo(Long id) {
        return setProdutoAtivo(id, true);
    }

    /**
     * (ADMIN) Exclui de vez (hard delete) um produto do catálogo.
     * SÓ PERMITE se nenhuma farmácia depender dele.
     */
    @Transactional
    public void deleteProdutoCatalogo(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado."));

        // VERIFICAÇÃO DE SEGURANÇA (Hard Delete)
        if (estoqueLojistaRepository.existsByProdutoId(id)) {
            throw new ConflictException("Este produto não pode ser excluído permanentemente pois está em uso no estoque de uma ou mais farmácias. Considere desativá-lo.");
        }

        // Se passou, é seguro deletar
        produtoRepository.delete(produto);
    }

    // Método auxiliar para mapeamento
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

    // Método auxiliar para soft delete/reactivate
    private Produto setProdutoAtivo(Long id, boolean ativo) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado."));
        produto.setAtivo(ativo);
        return produtoRepository.save(produto);
    }
}