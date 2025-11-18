package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.PasswordUpdateRequest;
import ucb.app.esculapy.dto.ProfileResponse;
import ucb.app.esculapy.dto.ProfileUpdateRequest;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.repository.ClienteRepository;
import ucb.app.esculapy.repository.UsuarioRepository;

@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthenticationService authenticationService;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public ProfileResponse getMeuProfile() {
        Usuario usuario = authenticationService.getUsuarioLogado();
        Cliente cliente = authenticationService.getClienteLogado();
        return new ProfileResponse(usuario, cliente);
    }

    @Transactional
    public ProfileResponse updateMeuProfile(ProfileUpdateRequest request) {
        Usuario usuario = authenticationService.getUsuarioLogado();
        Cliente cliente = authenticationService.getClienteLogado();

        cliente.setNome(request.getNome());
        cliente.setNumeroCelular(request.getNumeroCelular());
        Cliente clienteSalvo = clienteRepository.save(cliente);

        return new ProfileResponse(usuario, clienteSalvo);
    }

    @Transactional
    public void updateMinhaSenha(PasswordUpdateRequest request) {
        Usuario usuario = authenticationService.getUsuarioLogado();

        if (!passwordEncoder.matches(request.getSenhaAtual(), usuario.getPassword())) {
            throw new ForbiddenException("A senha atual está incorreta.");
        }

        if (passwordEncoder.matches(request.getNovaSenha(), usuario.getPassword())) {
            throw new ConflictException("A nova senha não pode ser igual à senha atual.");
        }

        usuario.setSenha(passwordEncoder.encode(request.getNovaSenha()));
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void forgotPassword(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario != null) {
            // Simulação: Em produção, enviaríamos um e-mail.
            System.out.println("LOG: Enviando e-mail de recuperação para " + email);
        }
        // Não retornamos erro se o e-mail não existir por segurança (Enumeration Attack)
    }

    @Transactional
    public void resetPassword(String token, String novaSenha) {
        // Simulação: Em produção, validaríamos o token no banco.
        // Aqui, aceitamos qualquer token para fins de teste/MVP.
        if (token == null || token.isEmpty()) {
            throw new ResourceNotFoundException("Token inválido.");
        }

        // Como não temos o token ligado ao usuário nesta simulação,
        // não podemos realmente mudar a senha de ninguém aqui.
        // Em um código real:
        // Token t = tokenRepo.findByToken(token);
        // Usuario u = t.getUser();
        // u.setSenha(...);
    }
}