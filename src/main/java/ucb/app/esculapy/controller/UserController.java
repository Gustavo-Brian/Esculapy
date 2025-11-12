package ucb.app.esculapy.controller;

import org.springframework.security.core.GrantedAuthority;
import ucb.app.esculapy.model.Farmaceutico;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Usuario;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.Data;
import ucb.app.esculapy.model.Cliente;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Data
    private static class MeResponse {
        private Long id;
        private String email;
        private List<String> roles;
        private ClienteProfile cliente;
        private FarmaciaAdminProfile farmaciaAdmin;
        private FarmaceuticoProfile farmaceutico;

        public MeResponse(Usuario usuario) {
            this.id = usuario.getId();
            this.email = usuario.getEmail();
            this.roles = usuario.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            if (usuario.getCliente() != null) {
                this.cliente = new ClienteProfile(usuario.getCliente());
            }
            if (usuario.getFarmaciaAdmin() != null) {
                this.farmaciaAdmin = new FarmaciaAdminProfile(usuario.getFarmaciaAdmin());
            }
            if (usuario.getFarmaceutico() != null) {
                this.farmaceutico = new FarmaceuticoProfile(usuario.getFarmaceutico());
            }
        }
    }

    @Data
    private static class ClienteProfile {
        private Long id;
        private String nome;
        private String cpf;
        public ClienteProfile(Cliente c) {
            this.id = c.getId(); this.nome = c.getNome(); this.cpf = c.getCpf();
        }
    }

    @Data
    private static class FarmaciaAdminProfile {
        private Long id;
        private String nomeFantasia;
        private String cnpj;
        private String status;
        public FarmaciaAdminProfile(Farmacia f) {
            this.id = f.getId(); this.nomeFantasia = f.getNomeFantasia(); this.cnpj = f.getCnpj(); this.status = f.getStatus().name();
        }
    }

    @Data
    private static class FarmaceuticoProfile {
        private Long id;
        private String nome;
        private String crfP;
        private Long farmaciaId;
        public FarmaceuticoProfile(Farmaceutico f) {
            this.id = f.getId(); this.nome = f.getNome(); this.crfP = f.getCrfP(); this.farmaciaId = f.getFarmacia().getId();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<MeResponse> getMyInfo() {
        // A lógica de busca do usuário já é tratada pelo Spring Security
        // e pelo AuthenticationService, que o injeta no contexto.
        Usuario usuario = (Usuario) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(new MeResponse(usuario));
    }
}