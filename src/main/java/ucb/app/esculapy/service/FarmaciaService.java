package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.dto.RegisterFarmaceuticoRequest;
import ucb.app.esculapy.exception.ForbiddenException;
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
        // 1. Pegar a Farmacia do Dono logado
        Farmacia farmaciaDono = authenticationService.getFarmaciaAdminLogada();

        // 2. Validar duplicatas
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new ForbiddenException("Email já está em uso.");
        }
        if (farmaceuticoRepository.existsByCpf(request.getCpf())) {
            throw new ForbiddenException("CPF já está em uso.");
        }
        if (farmaceuticoRepository.existsByCrfP(request.getCrfP())) {
            throw new ForbiddenException("CRF-P já está em uso.");
        }

        // 3. Buscar a Role
        Role farmaceuticoRole = roleRepository.findByNome("ROLE_FARMACEUTICO")
                .orElseThrow(() -> new RuntimeException("Erro: Role 'ROLE_FARMACEUTICO' não encontrada."));

        // 4. Criar o Usuario (para login)
        Usuario usuario = new Usuario(
                request.getEmail(),
                passwordEncoder.encode(request.getSenha())
        );
        usuario.setRoles(Set.of(farmaceuticoRole));

        // 5. Criar o Farmaceutico (perfil)
        Farmaceutico farmaceutico = new Farmaceutico();
        farmaceutico.setNome(request.getNome());
        farmaceutico.setCpf(request.getCpf());
        farmaceutico.setCrfP(request.getCrfP());
        farmaceutico.setNumeroCelular(request.getNumeroCelular());

        // 6. Linkar as entidades
        farmaceutico.setFarmacia(farmaciaDono); // Linka o funcionário à farmácia
        usuario.setFarmaceutico(farmaceutico); // Linka o login ao perfil (isso também seta farmaceutico.setUsuario)

        // 7. Salvar
        // Ao salvar o Usuario, o Farmaceutico será salvo por cascade
        usuarioRepository.save(usuario);

        return farmaceutico;
    }
}