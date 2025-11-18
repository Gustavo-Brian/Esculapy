package ucb.app.esculapy.dto;

import lombok.Data;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Usuario;

// DTO focado nos dados do Cliente (o único perfil editável por enquanto)
@Data
public class ProfileResponse {

    private Long usuarioId;
    private String email;
    private Long clienteId;
    private String nome;
    private String cpf;
    private String numeroCelular;

    public ProfileResponse(Usuario u, Cliente c) {
        this.usuarioId = u.getId();
        this.email = u.getEmail();
        this.clienteId = c.getId();
        this.nome = c.getNome();
        this.cpf = c.getCpf();
        this.numeroCelular = c.getNumeroCelular();
    }
}