package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.EstoqueRequest;
import ucb.app.esculapy.exception.ConflictException; // <-- REFATORADO
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.EstoqueLojista;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Produto;
import ucb.app.esculapy.repository.EstoqueLojistaRepository;
import ucb.app.esculapy.repository.ProdutoRepository;

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

        // REFATORADO: Duplicata é conflito (409)
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

        EstoqueLojista item = estoqueLojistaRepository.findById(estoqueId)
                .orElseThrow(() -> new ResourceNotFoundException("Item de estoque com ID " + estoqueId + " não encontrado."));

        // CORRETO: Validação de posse usa Forbidden (403)
        if (!item.getFarmacia().getId().equals(farmacia.getId())) {
            throw new ForbiddenException("Você não tem permissão para alterar o estoque de outra farmácia.");
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

        // CORRETO: Validação de posse usa Forbidden (403)
        if (!item.getFarmacia().getId().equals(farmacia.getId())) {
            throw new ForbiddenException("Você não tem permissão para remover o estoque de outra farmácia.");
        }

        estoqueLojistaRepository.delete(item);
    }
}