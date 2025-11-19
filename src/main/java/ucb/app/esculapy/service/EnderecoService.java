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

/**
 * Serviço responsável pela lógica de gerenciamento de endereços por parte do cliente.
 */
@Service
@RequiredArgsConstructor
public class EnderecoService {

    private final EnderecoRepository enderecoRepository;
    private final AuthenticationService authenticationService;
    private final ClienteRepository clienteRepository;

    /**
     * Lista paginada dos endereços do cliente logado.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de endereços.
     */
    @Transactional(readOnly = true)
    public Page<Endereco> getMeusEnderecos(Pageable pageable) {
        Cliente cliente = authenticationService.getClienteLogado();
        return enderecoRepository.findByClienteId(cliente.getId(), pageable);
    }

    /**
     * Adiciona um novo endereço para o cliente logado.
     *
     * @param request O DTO contendo os dados do novo endereço.
     * @return O objeto {@link Endereco} salvo.
     */
    @Transactional
    public Endereco adicionarEndereco(EnderecoRequest request) {
        Cliente cliente = authenticationService.getClienteLogado();

        Endereco endereco = new Endereco();
        mapRequestToEndereco(request, endereco);

        endereco.setCliente(cliente);

        return enderecoRepository.save(endereco);
    }

    /**
     * Atualiza um endereço existente do cliente logado.
     *
     * @param id O ID do endereço a ser atualizado.
     * @param request O DTO com os novos dados.
     * @return O objeto {@link Endereco} atualizado.
     * @throws ResourceNotFoundException Se o endereço não for encontrado ou não pertencer ao cliente.
     */
    @Transactional
    public Endereco atualizarEndereco(Long id, EnderecoRequest request) {
        Cliente cliente = authenticationService.getClienteLogado();

        Endereco endereco = enderecoRepository.findByIdAndClienteId(id, cliente.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço com ID " + id + " não encontrado ou não pertence a você."));

        mapRequestToEndereco(request, endereco);
        return enderecoRepository.save(endereco);
    }

    /**
     * Deleta um endereço do cliente logado.
     *
     * @param id O ID do endereço a ser deletado.
     * @throws ResourceNotFoundException Se o endereço não for encontrado ou não pertencer ao cliente.
     */
    @Transactional
    public void deletarEndereco(Long id) {
        Cliente cliente = authenticationService.getClienteLogado();

        Endereco endereco = enderecoRepository.findByIdAndClienteId(id, cliente.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Endereço com ID " + id + " não encontrado ou não pertence a você."));

        enderecoRepository.delete(endereco);
    }

    /**
     * Mapeia os dados de um {@link EnderecoRequest} para um objeto {@link Endereco}.
     *
     * @param request O DTO de requisição.
     * @param endereco O objeto Endereco de destino.
     */
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