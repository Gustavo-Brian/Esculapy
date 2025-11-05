package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import ucb.app.esculapy.model.enums.PedidoStatus;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ucb.app.esculapy.model.enums.TipoReceita;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // CLIENTE: Ignoramos na serialização de Pedido para evitar o loop Pedido -> Cliente -> Usuario
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PedidoStatus status;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    private LocalDateTime dataPedido = LocalDateTime.now();

    // ITENS: Ignoramos na serialização de Pedido para evitar o loop Pedido -> Itens -> Pedido
    @JsonIgnore
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    // RECEITA: Ignoramos na serialização de Pedido para evitar o loop Pedido -> Receita -> Pedido
    @JsonIgnore
    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Receita receita;

    // Método de Negócio (Isso não causa serialização, mas estava incompleto no import)
    public boolean isReceitaExigida() {
        return itens.stream().anyMatch(item ->
                item.getEstoqueLojista().getProduto().getTipoReceita() != TipoReceita.NAO_EXIGIDO
        );
    }
}