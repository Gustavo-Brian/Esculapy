package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.EstoqueRequest;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.ProdutoRepository;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EstoqueService {

    private final EstoqueLojistaRepository estoqueLojistaRepository;
    private final ProdutoRepository produtoRepository;
    private final AuthenticationService authenticationService;

    @Transactional
    public EstoqueLojista adicionarItemEstoque(EstoqueRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto do catálogo não encontrado."));

        // 1. Validação de Duplicidade
        estoqueLojistaRepository.findByFarmaciaIdAndProdutoId(farmacia.getId(), produto.getId())
                .ifPresent(estoque -> {
                    throw new ForbiddenException("Este produto já existe no seu estoque (ID: " + estoque.getId() + "). Use a rota de atualização (PUT) se quiser alterar preço ou quantidade.");
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

        EstoqueLojista item = estoqueLojistaRepository.findById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado."));

        // Validação de Posse
        if (!item.getFarmacia().getId().equals(farmacia.getId())) {
            throw new ForbiddenException("Você não tem permissão para alterar o estoque de outra farmácia.");
        }

        item.setPreco(request.getPreco());
        item.setQuantidade(request.getQuantidade());

        return estoqueLojistaRepository.save(item);
    }

    /**
     * Remove um item do estoque do lojista.
     * @param estoqueId O ID do registro de estoque a ser removido.
     */
    @Transactional
    public void deleteEstoque(Long estoqueId) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();

        // 1. Busca o item de estoque
        EstoqueLojista item = estoqueLojistaRepository.findById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado."));

        // 2. VALIDAÇÃO DE POSSE (CRUCIAL)
        if (!item.getFarmacia().getId().equals(farmacia.getId())) {
            throw new ForbiddenException("Você não tem permissão para remover o estoque de outra farmácia.");
        }

        // 3. Deleta o item
        estoqueLojistaRepository.delete(item);
    }
}