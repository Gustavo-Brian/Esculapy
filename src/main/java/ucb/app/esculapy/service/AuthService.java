package ucb.app.esculapy.service;

import ucb.app.esculapy.dto.AuthResponse;
import ucb.app.esculapy.dto.LoginRequest;
import ucb.app.esculapy.dto.RegisterClienteRequest;
import ucb.app.esculapy.dto.RegisterFarmaciaRequest;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Role;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.model.enums.LojistaStatus; // <-- 1. CORREÇÃO DO IMPORT
import ucb.app.esculapy.repository.ClienteRepository;
import ucb.app.esculapy.repository.FarmaciaRepository;
import ucb.app.esculapy.repository.RoleRepository;
import ucb.app.esculapy.repository.UsuarioRepository;
import ucb.app.esculapy.security.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final FarmaciaRepository farmaciaRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse registerCliente(RegisterClienteRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            // No futuro, podemos trocar por uma exceção customizada,
            // mas o AuthController já trata RuntimeException.
            throw new RuntimeException("Erro: Email já está em uso!");
        }
        if (clienteRepository.existsByCpf(request.getCpf())) {
            throw new RuntimeException("Erro: CPF já está em uso!");
        }

        Usuario usuario = new Usuario(
                request.getEmail(),
                passwordEncoder.encode(request.getSenha())
        );
        Role clienteRole = roleRepository.findByNome("ROLE_CLIENTE")
                .orElseThrow(() -> new RuntimeException("Erro: Role 'ROLE_CLIENTE' não encontrada."));
        usuario.setRoles(Set.of(clienteRole));

        Cliente cliente = new Cliente();
        cliente.setNome(request.getNome());
        cliente.setCpf(request.getCpf());
        cliente.setNumeroCelular(request.getNumeroCelular());
        cliente.setDataNascimento(request.getDataNascimento());

        // Método auxiliar bidirecional
        usuario.setCliente(cliente);

        Usuario savedUser = usuarioRepository.save(usuario);

        String jwtToken = jwtService.generateToken(savedUser);
        return new AuthResponse(jwtToken, savedUser.getId(), savedUser.getEmail());
    }

    @Transactional
    public AuthResponse registerFarmacia(RegisterFarmaciaRequest request) {
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Erro: Email já está em uso!");
        }
        if (farmaciaRepository.existsByCnpj(request.getCnpj())) {
            throw new RuntimeException("Erro: CNPJ já está em uso!");
        }
        if (farmaciaRepository.existsByCrfJ(request.getCrfJ())) {
            throw new RuntimeException("Erro: CRF-J já está em uso!");
        }

        Usuario usuario = new Usuario(
                request.getEmail(),
                passwordEncoder.encode(request.getSenha())
        );
        Role lojistaRole = roleRepository.findByNome("ROLE_LOJISTA_ADMIN")
                .orElseThrow(() -> new RuntimeException("Erro: Role 'ROLE_LOJISTA_ADMIN' não encontrada."));
        usuario.setRoles(Set.of(lojistaRole));

        Farmacia farmacia = new Farmacia();
        farmacia.setCnpj(request.getCnpj());
        farmacia.setRazaoSocial(request.getRazaoSocial());
        farmacia.setNomeFantasia(request.getNomeFantasia());
        farmacia.setCrfJ(request.getCrfJ());
        farmacia.setEmailContato(request.getEmailContato());
        farmacia.setNumeroCelularContato(request.getNumeroCelularContato());
        farmacia.setStatus(LojistaStatus.PENDENTE_APROVACAO); // <-- 2. CORREÇÃO DO NOME

        // Método auxiliar bidirecional
        usuario.setFarmaciaAdmin(farmacia);

        Usuario savedUser = usuarioRepository.save(usuario);

        String jwtToken = jwtService.generateToken(savedUser);
        return new AuthResponse(jwtToken, savedUser.getId(), savedUser.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getSenha()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        Usuario usuario = (Usuario) authentication.getPrincipal();
        String jwtToken = jwtService.generateToken(usuario);

        return new AuthResponse(jwtToken, usuario.getId(), usuario.getEmail());
    }
}