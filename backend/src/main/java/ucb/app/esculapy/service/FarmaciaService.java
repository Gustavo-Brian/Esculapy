package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.*;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.*;
import ucb.app.esculapy.model.enums.LojistaStatus;
import ucb.app.esculapy.repository.FarmaciaRepository;
import ucb.app.esculapy.repository.FarmaceuticoRepository;
import ucb.app.esculapy.repository.RoleRepository;
import ucb.app.esculapy.repository.UsuarioRepository;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Serviço responsável pela lógica de negócios da Farmácia, tanto para consultas públicas
 * quanto para o gerenciamento interno pelo lojista (Admin da Farmácia).
 */
@Service
@RequiredArgsConstructor
public class FarmaciaService {

    private final UsuarioRepository usuarioRepository;
    private final FarmaceuticoRepository farmaceuticoRepository;
    private final FarmaciaRepository farmaciaRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationService authenticationService;

    // ========================================================================
    // --- LÓGICA PÚBLICA ---
    // ========================================================================

    /**
     * Lista todas as farmácias ativas para consulta pública.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de {@link FarmaciaPublicaResponse}.
     */
    @Transactional(readOnly = true)
    public Page<FarmaciaPublicaResponse> listarFarmaciasPublico(Pageable pageable) {
        Page<Farmacia> farmacias = farmaciaRepository.findAllByStatusComEndereco(LojistaStatus.ATIVO, pageable);
        return farmacias.map(FarmaciaPublicaResponse::new);
    }

    /**
     * Obtém os detalhes de uma farmácia ativa por ID para consulta pública.
     *
     * @param id O ID da farmácia.
     * @return O DTO {@link FarmaciaPublicaResponse}.
     * @throws ResourceNotFoundException Se a farmácia não for encontrada ou não estiver ativa.
     */
    @Transactional(readOnly = true)
    public FarmaciaPublicaResponse getFarmaciaPublicaPorId(Long id) {
        Farmacia farmacia = farmaciaRepository.findPublicaById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmácia com ID " + id + " não encontrada ou está inativa."));
        return new FarmaciaPublicaResponse(farmacia);
    }

    // ========================================================================
    // --- LÓGICA PRIVADA (LOJISTA) ---
    // ========================================================================

    /**
     * Obtém os detalhes completos da farmácia do usuário logado.
     *
     * @return O objeto {@link Farmacia}.
     */
    @Transactional(readOnly = true)
    public Farmacia getMinhaFarmaciaCompleta() {
        return authenticationService.getFarmaciaAdminLogada();
    }

    /**
     * Atualiza as informações de contato e nome fantasia da farmácia.
     *
     * @param request O DTO {@link FarmaciaInfoRequest}.
     * @return O DTO de requisição.
     */
    @Transactional
    public FarmaciaInfoRequest updateInfo(FarmaciaInfoRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        farmacia.setNomeFantasia(request.getNomeFantasia());
        farmacia.setEmailContato(request.getEmailContato());
        farmacia.setNumeroCelularContato(request.getNumeroCelularContato());
        farmaciaRepository.save(farmacia);
        return request;
    }

    /**
     * Atualiza ou cria o endereço comercial da farmácia.
     *
     * @param request O DTO {@link EnderecoRequest}.
     * @return O objeto {@link Endereco} atualizado.
     */
    @Transactional
    public Endereco updateEndereco(EnderecoRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        Endereco endereco = farmacia.getEnderecoComercial();
        if (endereco == null) {
            endereco = new Endereco();
        }
        endereco.setCep(request.getCep());
        endereco.setLogradouro(request.getLogradouro());
        endereco.setNumero(request.getNumero());
        endereco.setComplemento(request.getComplemento());
        endereco.setBairro(request.getBairro());
        endereco.setCidade(request.getCidade());
        endereco.setEstado(request.getEstado());
        endereco.setTipo("COMERCIAL");
        farmacia.setEnderecoComercial(endereco);
        farmaciaRepository.save(farmacia);
        return endereco;
    }

    /**
     * Atualiza ou cria a conta bancária da farmácia.
     *
     * @param request O DTO {@link ContaBancariaRequest}.
     * @return O objeto {@link ContaBancaria} atualizado.
     */
    @Transactional
    public ContaBancaria updateContaBancaria(ContaBancariaRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        ContaBancaria conta = farmacia.getContaBancaria();
        if (conta == null) {
            conta = new ContaBancaria();
        }
        conta.setCodigoBanco(request.getCodigoBanco());
        conta.setAgencia(request.getAgencia());
        conta.setNumeroConta(request.getNumeroConta());
        conta.setDigitoVerificador(request.getDigitoVerificador());
        conta.setTipoConta(request.getTipoConta());
        conta.setDocumentoTitular(request.getDocumentoTitular());
        conta.setNomeTitular(request.getNomeTitular());
        farmacia.setContaBancaria(conta);
        farmaciaRepository.save(farmacia);
        return conta;
    }


    // --- Gerenciamento de Funcionários ---

    /**
     * Adiciona um novo farmacêutico à farmácia do lojista logado.
     *
     * @param request O DTO {@link RegisterFarmaceuticoRequest}.
     * @return O objeto {@link Farmaceutico} criado.
     * @throws ConflictException Se e-mail, CPF ou CRF-P já estiverem em uso.
     * @throws ResourceNotFoundException Se a Role não for encontrada.
     */
    @Transactional
    public Farmaceutico adicionarFarmaceutico(RegisterFarmaceuticoRequest request) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ConflictException("Email já está em uso.");
        }
        if (farmaceuticoRepository.existsByCpf(request.getCpf())) {
            throw new ConflictException("CPF já está em uso.");
        }
        if (farmaceuticoRepository.existsByCrfP(request.getCrfP())) {
            throw new ConflictException("CRF-P já está em uso.");
        }

        Role farmaceuticoRole = roleRepository.findByNome("ROLE_FARMACEUTICO")
                .orElseThrow(() -> new ResourceNotFoundException("Role 'ROLE_FARMACEUTICO' não encontrada."));

        Usuario usuario = new Usuario(
                request.getEmail(),
                passwordEncoder.encode(request.getSenha())
        );
        usuario.setRoles(Set.of(farmaceuticoRole));

        Farmaceutico farmaceutico = new Farmaceutico();
        farmaceutico.setNome(request.getNome());
        farmaceutico.setCpf(request.getCpf());
        farmaceutico.setCrfP(request.getCrfP());
        farmaceutico.setNumeroCelular(request.getNumeroCelular());

        farmaceutico.setFarmacia(farmaciaDono);
        usuario.setFarmaceutico(farmaceutico);

        usuarioRepository.save(usuario);
        return farmaceutico;
    }

    /**
     * Lista todos os farmacêuticos associados à farmácia logada.
     *
     * @param pageable As informações de paginação.
     * @return Uma página de {@link Farmaceutico}.
     */
    @Transactional(readOnly = true)
    public Page<Farmaceutico> listarFarmaceuticos(Pageable pageable) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();
        return farmaceuticoRepository.findAllByFarmaciaId(farmaciaDono.getId(), pageable);
    }

    /**
     * Atualiza as informações básicas de um farmacêutico.
     *
     * @param farmaceuticoId O ID do farmacêutico.
     * @param request O DTO {@link FarmaceuticoUpdateRequest}.
     * @return O objeto {@link Farmaceutico} atualizado.
     * @throws ResourceNotFoundException Se o farmacêutico não for encontrado.
     * @throws ForbiddenException Se o farmacêutico não pertencer à farmácia logada.
     */
    @Transactional
    public Farmaceutico atualizarFarmaceutico(Long farmaceuticoId, FarmaceuticoUpdateRequest request) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();

        Farmaceutico farmaceutico = getFarmaceuticoValidado(farmaceuticoId, farmaciaDono.getId());

        farmaceutico.setNome(request.getNome());
        farmaceutico.setNumeroCelular(request.getNumeroCelular());
        return farmaceuticoRepository.save(farmaceutico);
    }

    /**
     * Desativa a conta de login de um farmacêutico.
     *
     * @param farmaceuticoId O ID do farmacêutico.
     */
    @Transactional
    public void desativarFarmaceutico(Long farmaceuticoId) {
        setFarmaceuticoAtivo(farmaceuticoId, false);
    }

    /**
     * Reativa a conta de login de um farmacêutico.
     *
     * @param farmaceuticoId O ID do farmacêutico.
     */
    @Transactional
    public void reativarFarmaceutico(Long farmaceuticoId) {
        setFarmaceuticoAtivo(farmaceuticoId, true);
    }

    /**
     * Deleta permanentemente o farmacêutico e seu usuário associado.
     *
     * @param farmaceuticoId O ID do farmacêutico.
     * @throws ResourceNotFoundException Se o farmacêutico não for encontrado.
     * @throws ForbiddenException Se o farmacêutico não pertencer à farmácia logada.
     */
    @Transactional
    public void deletarFarmaceutico(Long farmaceuticoId) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();
        Farmaceutico farmaceutico = getFarmaceuticoValidado(farmaceuticoId, farmaciaDono.getId());

        usuarioRepository.delete(farmaceutico.getUsuario());
    }

    // --- Métodos Auxiliares ---

    /**
     * Altera o status de habilitação (enabled) do usuário do farmacêutico.
     *
     * @param farmaceuticoId O ID do farmacêutico.
     * @param ativo O novo estado (true para ativo, false para desativado).
     */
    private void setFarmaceuticoAtivo(Long farmaceuticoId, boolean ativo) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();
        Farmaceutico farmaceutico = getFarmaceuticoValidado(farmaceuticoId, farmaciaDono.getId());

        Usuario usuario = farmaceutico.getUsuario();
        usuario.setEnabled(ativo);
        usuarioRepository.save(usuario);
    }

    /**
     * Busca um farmacêutico pelo ID e verifica se ele pertence à farmácia especificada.
     *
     * @param farmaceuticoId O ID do farmacêutico.
     * @param farmaciaId O ID da farmácia esperada.
     * @return O objeto {@link Farmaceutico}.
     * @throws ResourceNotFoundException Se o farmacêutico não for encontrado.
     * @throws ForbiddenException Se o farmacêutico não pertencer à farmácia.
     */
    private Farmaceutico getFarmaceuticoValidado(Long farmaceuticoId, Long farmaciaId) {
        Farmaceutico farmaceutico = farmaceuticoRepository.findById(farmaceuticoId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmacêutico com ID " + farmaceuticoId + " não encontrado."));

        if (!farmaceutico.getFarmacia().getId().equals(farmaciaId)) {
            throw new ForbiddenException("Você não tem permissão para gerenciar este farmacêutico.");
        }
        return farmaceutico;
    }
}