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

/**
 * Serviço responsável pela lógica de gerenciamento do perfil do usuário logado (cliente).
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final AuthenticationService authenticationService;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Obtém o perfil completo do cliente logado.
     *
     * @return O DTO {@link ProfileResponse}.
     */
    @Transactional(readOnly = true)
    public ProfileResponse getMeuProfile() {
        Usuario usuario = authenticationService.getUsuarioLogado();
        Cliente cliente = authenticationService.getClienteLogado();
        return new ProfileResponse(usuario, cliente);
    }

    /**
     * Atualiza o nome e o número de celular do perfil do cliente.
     *
     * @param request O DTO com os novos dados.
     * @return O DTO {@link ProfileResponse} atualizado.
     */
    @Transactional
    public ProfileResponse updateMeuProfile(ProfileUpdateRequest request) {
        Usuario usuario = authenticationService.getUsuarioLogado();
        Cliente cliente = authenticationService.getClienteLogado();

        cliente.setNome(request.getNome());
        cliente.setNumeroCelular(request.getNumeroCelular());
        Cliente clienteSalvo = clienteRepository.save(cliente);

        return new ProfileResponse(usuario, clienteSalvo);
    }

    /**
     * Atualiza a senha do usuário logado.
     *
     * @param request O DTO contendo a senha atual e a nova senha.
     * @throws ForbiddenException Se a senha atual estiver incorreta.
     * @throws ConflictException Se a nova senha for igual à senha atual.
     */
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

    /**
     * Simula o início do fluxo de recuperação de senha (Forgot Password).
     *
     * @param email O e-mail do usuário.
     */
    @Transactional
    public void forgotPassword(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email).orElse(null);
        if (usuario != null) {
            System.out.println("LOG: Enviando e-mail de recuperação para " + email);
        }
    }

    /**
     * Simula o processo de redefinição de senha (Reset Password).
     *
     * @param token O token de recuperação.
     * @param novaSenha A nova senha.
     * @throws ResourceNotFoundException Se o token for inválido (simulação).
     */
    @Transactional
    public void resetPassword(String token, String novaSenha) {
        if (token == null || token.isEmpty()) {
            throw new ResourceNotFoundException("Token inválido.");
        }
    }
}