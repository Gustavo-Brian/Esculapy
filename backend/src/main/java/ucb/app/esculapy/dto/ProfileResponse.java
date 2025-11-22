package ucb.app.esculapy.dto;

import lombok.Data;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Usuario;

/**
 * DTO de resposta contendo os dados do perfil do cliente e do usuário
 * para exibição na tela de perfil.
 */
@Data
public class ProfileResponse {

    private Long usuarioId;
    private String email;
    private Long clienteId;
    private String nome;
    private String cpf;
    private String numeroCelular;

    /**
     * Construtor que mapeia as entidades {@link Usuario} e {@link Cliente} para o DTO.
     *
     * @param u A entidade Usuario.
     * @param c A entidade Cliente.
     */
    public ProfileResponse(Usuario u, Cliente c) {
        this.usuarioId = u.getId();
        this.email = u.getEmail();
        this.clienteId = c.getId();
        this.nome = c.getNome();
        this.cpf = c.getCpf();
        this.numeroCelular = c.getNumeroCelular();
    }
}