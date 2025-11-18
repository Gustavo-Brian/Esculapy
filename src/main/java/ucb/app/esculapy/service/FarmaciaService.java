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

    @Transactional(readOnly = true)
    public Page<FarmaciaPublicaResponse> listarFarmaciasPublico(Pageable pageable) {
        Page<Farmacia> farmacias = farmaciaRepository.findAllByStatusComEndereco(LojistaStatus.ATIVO, pageable);
        return farmacias.map(FarmaciaPublicaResponse::new);
    }

    @Transactional(readOnly = true)
    public FarmaciaPublicaResponse getFarmaciaPublicaPorId(Long id) {
        Farmacia farmacia = farmaciaRepository.findPublicaById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmácia com ID " + id + " não encontrada ou está inativa."));
        return new FarmaciaPublicaResponse(farmacia);
    }

    // ========================================================================
    // --- LÓGICA PRIVADA (LOJISTA) ---
    // ========================================================================

    @Transactional(readOnly = true)
    public Farmacia getMinhaFarmaciaCompleta() {
        return authenticationService.getFarmaciaAdminLogada();
    }

    @Transactional
    public FarmaciaInfoRequest updateInfo(FarmaciaInfoRequest request) {
        Farmacia farmacia = authenticationService.getFarmaciaAdminLogada();
        farmacia.setNomeFantasia(request.getNomeFantasia());
        farmacia.setEmailContato(request.getEmailContato());
        farmacia.setNumeroCelularContato(request.getNumeroCelularContato());
        farmaciaRepository.save(farmacia);
        return request;
    }

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

    @Transactional(readOnly = true)
    public Page<Farmaceutico> listarFarmaceuticos(Pageable pageable) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();
        return farmaceuticoRepository.findAllByFarmaciaId(farmaciaDono.getId(), pageable);
    }

    @Transactional
    public Farmaceutico atualizarFarmaceutico(Long farmaceuticoId, FarmaceuticoUpdateRequest request) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();

        Farmaceutico farmaceutico = getFarmaceuticoValidado(farmaceuticoId, farmaciaDono.getId());

        farmaceutico.setNome(request.getNome());
        farmaceutico.setNumeroCelular(request.getNumeroCelular());
        return farmaceuticoRepository.save(farmaceutico);
    }

    @Transactional
    public void desativarFarmaceutico(Long farmaceuticoId) {
        setFarmaceuticoAtivo(farmaceuticoId, false);
    }

    @Transactional
    public void reativarFarmaceutico(Long farmaceuticoId) {
        setFarmaceuticoAtivo(farmaceuticoId, true);
    }

    @Transactional
    public void deletarFarmaceutico(Long farmaceuticoId) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();
        Farmaceutico farmaceutico = getFarmaceuticoValidado(farmaceuticoId, farmaciaDono.getId());

        // Hard delete: Remove o Usuario, que cascateia para Farmaceutico e Perfis
        usuarioRepository.delete(farmaceutico.getUsuario());
    }

    // --- Métodos Auxiliares ---

    private void setFarmaceuticoAtivo(Long farmaceuticoId, boolean ativo) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();
        Farmaceutico farmaceutico = getFarmaceuticoValidado(farmaceuticoId, farmaciaDono.getId());

        Usuario usuario = farmaceutico.getUsuario();
        usuario.setEnabled(ativo);
        usuarioRepository.save(usuario);
    }

    private Farmaceutico getFarmaceuticoValidado(Long farmaceuticoId, Long farmaciaId) {
        Farmaceutico farmaceutico = farmaceuticoRepository.findById(farmaceuticoId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmacêutico com ID " + farmaceuticoId + " não encontrado."));

        if (!farmaceutico.getFarmacia().getId().equals(farmaciaId)) {
            throw new ForbiddenException("Você não tem permissão para gerenciar este farmacêutico.");
        }
        return farmaceutico;
    }
}