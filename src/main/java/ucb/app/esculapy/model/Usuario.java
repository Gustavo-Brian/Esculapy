package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
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

@Entity
@Table(name = "usuarios", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email")
})
@Getter
@Setter
@NoArgsConstructor
public class Usuario implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

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

    // Relação com o perfil de Cliente
    @JsonIgnore // <-- ADICIONADO PARA QUEBRAR O LOOP
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Cliente cliente;

    // Relação com o perfil de Admin da Farmácia (Dono)
    @JsonIgnore // <-- ADICIONADO PARA QUEBRAR O LOOP
    @OneToOne(mappedBy = "usuarioAdmin", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Farmacia farmaciaAdmin;

    // Relação com o perfil de Farmacêutico (Funcionário)
    @JsonIgnore // <-- ADICIONADO PARA QUEBRAR O LOOP FINAL: Farmaceutico <-> Usuario
    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Farmaceutico farmaceutico;

    // Construtor usado pelo AuthService
    public Usuario(String email, String senha) {
        this.email = email;
        this.senha = senha;
    }

    // --- Métodos auxiliares para linkar perfis (Bidirecionais) ---

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

    // --- Implementação da Interface UserDetails ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getNome()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return this.senha;
    }

    @Override
    public String getUsername() {
        // Usamos o email como "username" para o Spring Security
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }
}