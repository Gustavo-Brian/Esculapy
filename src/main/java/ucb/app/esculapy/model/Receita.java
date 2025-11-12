package ucb.app.esculapy.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import ucb.app.esculapy.model.enums.ReceitaStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "receitas")
@Getter
@Setter
@NoArgsConstructor
public class Receita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "pedido_id", referencedColumnName = "id", unique = true)
    private Pedido pedido;

    @Column(nullable = false)
    private String arquivoUrl; // URL (ex: S3) onde o PDF/JPG foi salvo

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReceitaStatus status = ReceitaStatus.PENDENTE_VALIDACAO;

    private LocalDateTime dataUpload = LocalDateTime.now();

    // Quem validou?
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmaceutico_id")
    private Farmaceutico farmaceuticoValidador;

    private LocalDateTime dataValidacao;

    @Column(length = 500)
    private String justificativaRejeicao;
}