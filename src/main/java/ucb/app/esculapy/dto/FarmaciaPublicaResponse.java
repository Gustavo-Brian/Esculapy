package ucb.app.esculapy.dto;

import lombok.Data;
import ucb.app.esculapy.model.Endereco;
import ucb.app.esculapy.model.Farmacia;

@Data
public class FarmaciaPublicaResponse {

    private Long id;
    private String nomeFantasia;
    private Endereco enderecoComercial;

    public FarmaciaPublicaResponse(Farmacia farmacia) {
        this.id = farmacia.getId();
        this.nomeFantasia = farmacia.getNomeFantasia();
        this.enderecoComercial = farmacia.getEnderecoComercial();
    }
}