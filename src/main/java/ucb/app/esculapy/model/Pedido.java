package ucb.app.esculapy.model;

import ucb.app.esculapy.model.enums.PedidoStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import ucb.app.esculapy.model.enums.TipoReceita; // <-- Import necessário para o método (agora removido)

@Entity
@Table(name = "pedidos")
@Getter
@Setter
@NoArgsConstructor
public class Pedido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "cliente_id")
    private Cliente cliente;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PedidoStatus status;

    @Column(nullable = false)
    private BigDecimal valorTotal;

    private LocalDateTime dataPedido = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();

    @OneToOne(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Receita receita;

    // O MÉTODO isReceitaExigida() FOI REMOVIDO DESTA ENTIDADE
    // A lógica foi movida para o PedidoService para evitar N+1 queries.
}