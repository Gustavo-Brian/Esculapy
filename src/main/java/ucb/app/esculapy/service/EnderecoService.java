package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.EnderecoRequest;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Endereco;
import ucb.app.esculapy.repository.EnderecoRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final AuthenticationService authenticationService;

    @Transactional(readOnly = true)
    public List<Endereco> getMeusEnderecos() {
        Cliente cliente = authenticationService.getClienteLogado();
        return enderecoRepository.findByClienteId(cliente.getId());
    }

    @Transactional
    public Endereco adicionarEndereco(EnderecoRequest request) {
        Cliente cliente = authenticationService.getClienteLogado();

        Endereco endereco = new Endereco();
        mapRequestToEndereco(request, endereco);
        endereco.setCliente(cliente); // Linka o endereço ao cliente logado

        return enderecoRepository.save(endereco);
    }

    @Transactional
    public Endereco atualizarEndereco(Long id, EnderecoRequest request) {
        Cliente cliente = authenticationService.getClienteLogado();

        // A query findByIdAndClienteId garante que o cliente só possa
        // editar um endereço que é dele
        Endereco endereco = enderecoRepository.findByIdAndClienteId(id, cliente.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço com ID " + id + " não encontrado ou não pertence a você."));

        mapRequestToEndereco(request, endereco);
        return enderecoRepository.save(endereco);
    }

    @Transactional
    public void deletarEndereco(Long id) {
        Cliente cliente = authenticationService.getClienteLogado();

        Endereco endereco = enderecoRepository.findByIdAndClienteId(id, cliente.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço com ID " + id + " não encontrado ou não pertence a você."));

        enderecoRepository.delete(endereco);
    }

    // Método auxiliar para mapear o DTO para a entidade
    private void mapRequestToEndereco(EnderecoRequest request, Endereco endereco) {
        endereco.setCep(request.getCep());
        endereco.setLogradouro(request.getLogradouro());
        endereco.setNumero(request.getNumero());
        endereco.setComplemento(request.getComplemento());
        endereco.setBairro(request.getBairro());
        endereco.setCidade(request.getCidade());
        endereco.setEstado(request.getEstado());
        endereco.setTipo(request.getTipo());
    }
}