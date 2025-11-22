package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Entidade principal de usuário que implementa {@link UserDetails} para integração com o Spring Security.
 * Contém informações de autenticação (e-mail e senha) e links para perfis específicos (Cliente, Farmácia Admin, Farmacêutico).
 */
@Entity
@Table(name = "usuarios", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String senha;

    private boolean enabled = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime dataCriacao = LocalDateTime.now();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "usuario_roles",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @JsonIgnore
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Cliente cliente;

    @JsonIgnore
    @OneToOne(mappedBy = "usuarioAdmin", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Farmacia farmaciaAdmin;

    @JsonIgnore
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Farmaceutico farmaceutico;

    /**
     * Construtor para criação de um novo usuário com e-mail e senha.
     *
     * @param email O e-mail (nome de usuário).
     * @param senha A senha codificada.
     */
    public Usuario(String email, String senha) {
        this.email = email;
        this.senha = senha;
    }

    /**
     * Define o perfil de cliente e gerencia a relação bidirecional.
     *
     * @param cliente O perfil de {@link Cliente} a ser associado.
     */
    public void setCliente(Cliente cliente) {
        if (cliente == null) {
            if (this.cliente != null) {
                this.cliente.setUsuario(null);
            }
        } else {
            cliente.setUsuario(this);
        }
        this.cliente = cliente;
    }

    /**
     * Define o perfil de administrador de farmácia e gerencia a relação bidirecional.
     *
     * @param farmacia O perfil de {@link Farmacia} a ser associado como administrador.
     */
    public void setFarmaciaAdmin(Farmacia farmacia) {
        if (farmacia == null) {
            if (this.farmaciaAdmin != null) {
                this.farmaciaAdmin.setUsuarioAdmin(null);
            }
        } else {
            farmacia.setUsuarioAdmin(this);
        }
        this.farmaciaAdmin = farmacia;
    }

    /**
     * Define o perfil de farmacêutico e gerencia a relação bidirecional.
     *
     * @param farmaceutico O perfil de {@link Farmaceutico} a ser associado.
     */
    public void setFarmaceutico(Farmaceutico farmaceutico) {
        if (farmaceutico == null) {
            if (this.farmaceutico != null) {
                this.farmaceutico.setUsuario(null);
            }
        } else {
            farmaceutico.setUsuario(this);
        }
        this.farmaceutico = farmaceutico;
    }

    /**
     * Retorna as autorizações (Roles) do usuário para o Spring Security.
     *
     * @return Uma coleção de {@link GrantedAuthority}.
     */
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getNome()))
                .collect(Collectors.toList());
    }

    /**
     * Retorna a senha do usuário.
     *
     * @return A senha codificada.
     */
    @Override
    public String getPassword() {
        return this.senha;
    }

    /**
     * Retorna o nome de usuário (e-mail).
     *
     * @return O e-mail do usuário.
     */
    @Override
    public String getUsername() {
        return this.email;
    }

    /**
     * Indica se a conta não expirou.
     *
     * @return Sempre true.
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Indica se a conta não está bloqueada.
     *
     * @return Sempre true.
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Indica se as credenciais (senha) não expiraram.
     *
     * @return Sempre true.
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Indica se o usuário está habilitado.
     *
     * @return O valor do campo enabled.
     */
    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}