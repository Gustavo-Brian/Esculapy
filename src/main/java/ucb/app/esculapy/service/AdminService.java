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

    // --- Lógica de Farmácias (Refatorada) ---

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
     * (ADMIN) Ativa uma farmácia (seja ela PENDENTE ou SUSPENSA).
     */
    @Transactional
    public Farmacia ativarFarmacia(Long farmaciaId) {
        Farmacia farmacia = farmaciaRepository.findById(farmaciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmácia com ID " + farmaciaId + " não encontrada."));

        if (farmacia.getStatus() == LojistaStatus.ATIVO) {
            throw new ConflictException("A farmácia já está ativa.");
        }

        // Seta como ATIVO, não importa se estava PENDENTE ou SUSPENSO
        farmacia.setStatus(LojistaStatus.ATIVO);
        return farmaciaRepository.save(farmacia);
    }

    /**
     * (ADMIN) Desativa (suspende) uma farmácia.
     */
    @Transactional
    public Farmacia desativarFarmacia(Long farmaciaId) {
        Farmacia farmacia = farmaciaRepository.findById(farmaciaId)
                .orElseThrow(() -> new ResourceNotFoundException("Farmácia com ID " + farmaciaId + " não encontrada."));

        if (farmacia.getStatus() == LojistaStatus.SUSPENSO) {
            throw new ConflictException("A farmácia já está suspensa/desativada.");
        }

        farmacia.setStatus(LojistaStatus.SUSPENSO);
        return farmaciaRepository.save(farmacia);
    }

    // --- Lógica de Usuários (Sem alteração) ---

    @Transactional(readOnly = true)
    public Usuario findUsuarioByEmail(String email) {
        // A query findByEmail já é otimizada com EntityGraph
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