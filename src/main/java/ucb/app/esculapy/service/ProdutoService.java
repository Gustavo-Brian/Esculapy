package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.EstoqueResponse;
import ucb.app.esculapy.dto.ProdutoRequest;
import ucb.app.esculapy.exception.ForbiddenException;
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
    private final EstoqueLojistaRepository estoqueLojistaRepository;

    /**
     * Lógica para GET /api/produtos/buscar?nome=...
     */
    @Transactional(readOnly = true)
    public List<EstoqueResponse> buscarProdutosPorNome(String nome) {
        // 1. Usa a query otimizada do repositório
        List<EstoqueLojista> estoques = estoqueLojistaRepository.findByProdutoNomeContendo(nome);

        // 2. Mapeia a lista de Entidades para a lista de DTOs
        return estoques.stream()
                .map(EstoqueResponse::new) // Usa o construtor que criamos no DTO
                .collect(Collectors.toList());
    }

    /**
     * Lógica para GET /api/produtos/{id}
     */
    @Transactional(readOnly = true)
    public Produto getProdutoPorId(Long id) {
        // 1. Busca o produto no catálogo central
        return produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto com ID " + id + " não encontrado no catálogo."));
    }

    /**
     * Lógica para GET /api/produtos/{id}/ofertas
     */
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

    /**
     * Lógica para POST /api/produtos (Admin)
     */
    @Transactional
    public Produto criarProdutoCatalogo(ProdutoRequest request) {
        // 1. Validar duplicatas
        if (produtoRepository.findByEan(request.getEan()).isPresent()) {
            throw new ForbiddenException("EAN (Código de Barras) '" + request.getEan() + "' já cadastrado.");
        }
        if (produtoRepository.findByCodigoRegistroMS(request.getCodigoRegistroMS()).isPresent()) {
            throw new ForbiddenException("Código de Registro MS '" + request.getCodigoRegistroMS() + "' já cadastrado.");
        }

        // 2. Mapear DTO para Entidade
        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setEan(request.getEan());
        produto.setPrincipioAtivo(request.getPrincipioAtivo());
        produto.setLaboratorio(request.getLaboratorio());
        produto.setDescricao(request.getDescricao());
        produto.setCodigoRegistroMS(request.getCodigoRegistroMS());
        produto.setBulaUrl(request.getBulaUrl());
        produto.setTipoProduto(request.getTipoProduto());
        produto.setTipoReceita(request.getTipoReceita());

        // 3. Salvar no banco
        return produtoRepository.save(produto);
    }
}