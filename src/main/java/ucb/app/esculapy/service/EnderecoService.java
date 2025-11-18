package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.EnderecoRequest;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Endereco;
import ucb.app.esculapy.repository.ClienteRepository;
import ucb.app.esculapy.repository.EnderecoRepository;

@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final AuthenticationService authenticationService;
    private final ClienteRepository clienteRepository; // Manter para o getClienteLogado()

    @Transactional(readOnly = true)
    public Page<Endereco> getMeusEnderecos(Pageable pageable) {
        Cliente cliente = authenticationService.getClienteLogado();
        return enderecoRepository.findByClienteId(cliente.getId(), pageable);
    }

    // --- BLOCO CORRIGIDO ---
    @Transactional
    public Endereco adicionarEndereco(EnderecoRequest request) {
        Cliente cliente = authenticationService.getClienteLogado();

        Endereco endereco = new Endereco();
        mapRequestToEndereco(request, endereco);

        // 1. Define o "dono" do endereço (o lado @ManyToOne)
        endereco.setCliente(cliente);

        // 2. Salva o próprio endereço, que agora contém o cliente_id
        return enderecoRepository.save(endereco);
    }
    // --- FIM DO BLOCO ---

    @Transactional
    public Endereco atualizarEndereco(Long id, EnderecoRequest request) {
        Cliente cliente = authenticationService.getClienteLogado();

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