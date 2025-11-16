package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.*; // Importa todos os DTOs
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
    // --- LÓGICA PÚBLICA (Para o novo FarmaciaController) ---
    // ========================================================================

    @Transactional(readOnly = true)
    public List<FarmaciaPublicaResponse> listarFarmaciasPublico() {
        // Usa a nova query otimizada
        List<Farmacia> farmacias = farmaciaRepository.findAllByStatusComEndereco(LojistaStatus.ATIVO);

        return farmacias.stream()
                .map(FarmaciaPublicaResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FarmaciaPublicaResponse getFarmaciaPublicaPorId(Long id) {
        Farmacia farmacia = farmaciaRepository.findPublicaById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Farmácia com ID " + id + " não encontrada ou está inativa."));

        return new FarmaciaPublicaResponse(farmacia);
    }

    // ========================================================================
    // --- LÓGICA PRIVADA (Para o FarmaciaAdminController) ---
    // ========================================================================

    // --- Gerenciamento de Funcionários (EXPANDIDO) ---

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
    public List<Farmaceutico> listarFarmaceuticos() {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();
        return farmaceuticoRepository.findAllByFarmaciaId(farmaciaDono.getId());
    }

    @Transactional
    public Farmaceutico atualizarFarmaceutico(Long farmaceuticoId, FarmaceuticoUpdateRequest request) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();

        Farmaceutico farmaceutico = farmaceuticoRepository.findById(farmaceuticoId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmacêutico com ID " + farmaceuticoId + " não encontrado."));

        // Validação de posse
        if (!farmaceutico.getFarmacia().getId().equals(farmaciaDono.getId())) {
            throw new ForbiddenException("Você não tem permissão para gerenciar este farmacêutico.");
        }

        farmaceutico.setNome(request.getNome());
        farmaceutico.setNumeroCelular(request.getNumeroCelular());
        return farmaceuticoRepository.save(farmaceutico);
    }

    @Transactional
    public void desativarFarmaceutico(Long farmaceuticoId) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();

        Farmaceutico farmaceutico = farmaceuticoRepository.findById(farmaceuticoId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmacêutico com ID " + farmaceuticoId + " não encontrado."));

        // Validação de posse
        if (!farmaceutico.getFarmacia().getId().equals(farmaciaDono.getId())) {
            throw new ForbiddenException("Você não tem permissão para gerenciar este farmacêutico.");
        }

        // Desativa o usuário (login)
        Usuario usuario = farmaceutico.getUsuario();
        usuario.setEnabled(false);
        usuarioRepository.save(usuario);

        // (Opcional) Você pode querer desvincular ou marcar o
        // Farmaceutico como 'INATIVO' no futuro, mas desativar
        // o usuário principal (login) é o passo mais importante.
    }

    // --- Gerenciamento da Própria Farmácia ---

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
        endereco.setTipo("COMERCIAL"); // Tipo fixo para farmácia
        farmacia.setEnderecoComercial(endereco);
        farmaciaRepository.save(farmacia); // Salva a farmácia (o Endereço vai junto por Cascade)

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
        farmaciaRepository.save(farmacia); // Salva a farmácia (a Conta vai junto por Cascade)

        return conta;
    }
}