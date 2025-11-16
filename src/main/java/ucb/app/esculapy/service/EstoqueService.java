package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.EstoqueRequest;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.FarmaciaRepository; // Importar
import ucb.app.esculapy.repository.ProdutoRepository;

import java.util.List;
import java.util.Optional; // Importar

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final EstoqueLojistaRepository estoqueLojistaRepository;
    private final ProdutoRepository produtoRepository;
    private final AuthenticationService authenticationService;
    private final FarmaciaRepository farmaciaRepository; // Necessário para validação

    // --- LÓGICA PÚBLICA (Para o EstoqueController) ---

    /**
     * NOVO MÉTODO (Público)
     * Busca o estoque de uma farmácia específica pelo ID.
     */
    @Transactional(readOnly = true)
    public List<EstoqueLojista> getEstoqueDaFarmaciaPublico(Long farmaciaId) {
        // Valida se a farmácia existe antes de buscar o estoque
        if (!farmaciaRepository.existsById(farmaciaId)) {
            throw new ResourceNotFoundException("Farmácia com ID " + farmaciaId + " não encontrada.");
        }
        // Usa a nova query que filtra apenas itens ativos
        return estoqueLojistaRepository.findPublicoByFarmaciaId(farmaciaId);
    }

    /**
     * NOVO MÉTODO (Público)
     * Busca um item de estoque específico pelo seu ID.
     */
    @Transactional(readOnly = true)
    public EstoqueLojista getEstoquePorIdPublico(Long estoqueId) {
        // Usa a nova query que filtra apenas itens ativos
        return estoqueLojistaRepository.findPublicoById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado ou está inativo."));
    }


    // --- LÓGICA PRIVADA (Para o FarmaciaAdminController) ---

    /**
     * Busca todos os itens de estoque da farmácia LOGADA.
     */
    @Transactional(readOnly = true)
    public List<EstoqueLojista> getEstoqueDaFarmacia() {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        // Este método não precisa filtrar por "ativo" pois é o admin vendo seu
        // próprio estoque
        return estoqueLojistaRepository.findByFarmaciaId(farmacia.getId());
    }

    @Transactional
    public EstoqueLojista adicionarItemEstoque(EstoqueRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto do catálogo não encontrado."));

        estoqueLojistaRepository.findByFarmaciaIdAndProdutoId(farmacia.getId(), produto.getId())
                .ifPresent(estoque -> {
                    throw new ConflictException("Este produto já existe no seu estoque (ID: " + estoque.getId() + "). Use a rota de atualização (PUT) se quiser alterar preço ou quantidade.");
                });

        EstoqueLojista novoItem = new EstoqueLojista();
        novoItem.setFarmacia(farmacia);
        novoItem.setProduto(produto);
        novoItem.setPreco(request.getPreco());
        novoItem.setQuantidade(request.getQuantidade());
        // novoItem.setAtivo(true); // O 'ativo' já tem 'true' como default no modelo EstoqueLojista

        return estoqueLojistaRepository.save(novoItem);
    }

    @Transactional
    public EstoqueLojista updateEstoque(Long estoqueId, EstoqueRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();

        EstoqueLojista item = estoqueLojistaRepository.findById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado."));

        if (!item.getFarmacia().getId().equals(farmacia.getId())) {
            throw new ForbiddenException("Você não tem permissão para alterar o estoque de outra farmácia.");
        }

        // Valida se o ID do produto foi alterado, o que não deve acontecer em um
        // PUT.
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

        EstoqueLojista item = estoqueLojistaRepository.findById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado."));

        if (!item.getFarmacia().getId().equals(farmacia.getId())) {
            throw new ForbiddenException("Você não tem permissão para remover o estoque de outra farmácia.");
        }

        // NOTA: Futuramente, verificar se o item está em um pedido aberto
        // antes de permitir a exclusão.

        estoqueLojistaRepository.delete(item);
    }
}