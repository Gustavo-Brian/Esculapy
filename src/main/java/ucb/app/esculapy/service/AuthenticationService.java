package ucb.app.esculapy.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import ucb.app.esculapy.exception.ForbiddenException;
import ucb.app.esculapy.model.Cliente;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Farmaceutico;
import ucb.app.esculapy.model.Usuario;

/**
 * Serviço auxiliar para obter o principal de segurança (usuário logado)
 * e seus perfis de forma segura e centralizada.
 */
@Component
public class AuthenticationService {

    /**
     * Busca a autenticação atual do Spring Security.
     *
     * @return O objeto {@link Authentication}.
     */
    public Authentication getAuthentication() {
        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * Retorna a entidade {@link Usuario} completa do usuário logado.
     *
     * @return O objeto {@link Usuario}.
     * @throws ForbiddenException Se não houver usuário autenticado.
     */
    public Usuario getUsuarioLogado() {
        Authentication authentication = getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            throw new ForbiddenException("Nenhum usuário autenticado encontrado. Acesso negado.");
        }
        return (Usuario) authentication.getPrincipal();
    }

    /**
     * Retorna o perfil de {@link Cliente} do usuário logado.
     *
     * @return O objeto {@link Cliente}.
     * @throws ForbiddenException Se o usuário logado não for um cliente.
     */
    public Cliente getClienteLogado() {
        Usuario usuario = getUsuarioLogado();
        Cliente cliente = usuario.getCliente();

        if (cliente == null) {
            throw new ForbiddenException("O usuário logado não possui um perfil de cliente.");
        }
        return cliente;
    }

    /**
     * Retorna o perfil de Admin de {@link Farmacia} do usuário logado.
     *
     * @return O objeto {@link Farmacia}.
     * @throws ForbiddenException Se o usuário logado não for um dono de farmácia.
     */
    public Farmacia getFarmaciaAdminLogada() {
        Usuario usuario = getUsuarioLogado();
        Farmacia farmacia = usuario.getFarmaciaAdmin();

        if (farmacia == null) {
            throw new ForbiddenException("O usuário logado não possui um perfil de administrador de farmácia.");
        }
        return farmacia;
    }

    /**
     * Retorna o perfil de {@link Farmaceutico} do usuário logado.
     *
     * @return O objeto {@link Farmaceutico}.
     * @throws ForbiddenException Se o usuário logado não for um farmacêutico.
     */
    public Farmaceutico getFarmaceuticoLogado() {
        Usuario usuario = getUsuarioLogado();
        Farmaceutico farmaceutico = usuario.getFarmaceutico();

        if (farmaceutico == null) {
            throw new ForbiddenException("O usuário logado não possui um perfil de farmacêutico.");
        }
        return farmaceutico;
    }
}