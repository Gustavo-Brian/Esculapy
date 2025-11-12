package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.RegisterFarmaceuticoRequest;
import ucb.app.esculapy.exception.ConflictException; // <-- REFATORADO
import ucb.app.esculapy.exception.ResourceNotFoundException; // <-- REFATORADO
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Farmaceutico;
import ucb.app.esculapy.model.Role;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.repository.FarmaceuticoRepository;
import ucb.app.esculapy.repository.RoleRepository;
import ucb.app.esculapy.repository.UsuarioRepository;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class FarmaciaService {

    private final UsuarioRepository usuarioRepository;
    private final FarmaceuticoRepository farmaceuticoRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationService authenticationService;

    @Transactional
    public Farmaceutico adicionarFarmaceutico(RegisterFarmaceuticoRequest request) {
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();

        // REFATORADO: Duplicatas são conflitos (409)
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
}