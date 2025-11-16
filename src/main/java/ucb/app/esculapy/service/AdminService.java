package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.model.enums.LojistaStatus;
import ucb.app.esculapy.repository.FarmaciaRepository;
import ucb.app.esculapy.repository.UsuarioRepository;

import java.util.List;

/**
 * Service para a lógica de negócios do Administrador Master.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final FarmaciaRepository farmaciaRepository;
    private final UsuarioRepository usuarioRepository;

    // --- Lógica de Farmácias (REFATORADA) ---

    @Transactional(readOnly = true)
    public List<Farmacia> findFarmaciasByStatus(String status) {
        try {
            LojistaStatus lojistaStatus = LojistaStatus.valueOf(status.toUpperCase());
            return farmaciaRepository.findByStatus(lojistaStatus);
        } catch (IllegalArgumentException e) {
            throw new ConflictException("Status '" + status + "' é inválido. Use PENDENTE_APROVACAO, ATIVO ou SUSPENSO.");
        }
    }

    /**
     * (ADMIN) Aprova uma farmácia PENDENTE.
     */
    @Transactional
    public Farmacia aprovarFarmacia(Long farmaciaId) {
        Farmacia farmacia = farmaciaRepository.findById(farmaciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmácia com ID " + farmaciaId + " não encontrada."));

        if (farmacia.getStatus() != LojistaStatus.PENDENTE_APROVACAO) {
            throw new ConflictException("Esta farmácia não está PENDENTE_APROVACAO. Status atual: " + farmacia.getStatus());
        }

        farmacia.setStatus(LojistaStatus.ATIVO);
        return farmaciaRepository.save(farmacia);
    }

    /**
     * (ADMIN) Suspende uma farmácia ATIVA.
     */
    @Transactional
    public Farmacia suspenderFarmacia(Long farmaciaId) {
        Farmacia farmacia = farmaciaRepository.findById(farmaciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmácia com ID " + farmaciaId + " não encontrada."));

        if (farmacia.getStatus() != LojistaStatus.ATIVO) {
            throw new ConflictException("Apenas farmácias ATIVAS podem ser suspensas. Status atual: " + farmacia.getStatus());
        }

        farmacia.setStatus(LojistaStatus.SUSPENSO);
        return farmaciaRepository.save(farmacia);
    }

    /**
     * (ADMIN) Reativa uma farmácia SUSPENSA.
     */
    @Transactional
    public Farmacia reativarFarmacia(Long farmaciaId) {
        Farmacia farmacia = farmaciaRepository.findById(farmaciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmácia com ID " + farmaciaId + " não encontrada."));

        if (farmacia.getStatus() != LojistaStatus.SUSPENSO) {
            throw new ConflictException("Apenas farmácias SUSPENSAS podem ser reativadas. Status atual: " + farmacia.getStatus());
        }

        farmacia.setStatus(LojistaStatus.ATIVO);
        return farmaciaRepository.save(farmacia);
    }


    // --- Lógica de Usuários (Sem alteração) ---

    @Transactional(readOnly = true)
    public Usuario findUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário com e-mail '" + email + "' não encontrado."));
    }

    @Transactional
    public Usuario setUsuarioEnabled(Long usuarioId, boolean isEnabled) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário com ID " + usuarioId + " não encontrado."));

        usuario.setEnabled(isEnabled);
        return usuarioRepository.save(usuario);
    }
}