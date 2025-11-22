package ucb.app.esculapy.dto;

import lombok.Data;
import ucb.app.esculapy.model.Endereco;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.enums.LojistaStatus;

/**
 * DTO de resposta para consulta pública de farmácias, contendo apenas informações essenciais
 * como ID, nome, contato e endereço comercial.
 */
@Data
public class FarmaciaPublicaResponse {

    private Long id;
    private String nomeFantasia;
    private String razaoSocial;
    private String numeroCelularContato;
    private String emailContato;
    private LojistaStatus status;
    private Endereco enderecoComercial;

    /**
     * Construtor que mapeia a entidade {@link Farmacia} para o DTO de resposta pública.
     *
     * @param farmacia A entidade Farmacia.
     */
    public FarmaciaPublicaResponse(Farmacia farmacia) {
        this.id = farmacia.getId();
        this.nomeFantasia = farmacia.getNomeFantasia();
        this.razaoSocial = farmacia.getRazaoSocial();
        this.numeroCelularContato = farmacia.getNumeroCelularContato();
        this.emailContato = farmacia.getEmailContato();
        this.status = farmacia.getStatus();
        this.enderecoComercial = farmacia.getEnderecoComercial();
    }
}