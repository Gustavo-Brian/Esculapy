package ucb.app.esculapy.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ucb.app.esculapy.exception.ConflictException;
import ucb.app.esculapy.exception.ResourceNotFoundException;
import ucb.app.esculapy.model.Farmacia;
import ucb.app.esculapy.model.Usuario;
import ucb.app.esculapy.model.enums.LojistaStatus;
import ucb.app.esculapy.repository.FarmaciaRepository;
import ucb.app.esculapy.repository.UsuarioRepository;

/**
 * Serviço responsável pela lógica de negócios do Administrador Global da Plataforma.
 * Gerencia o status de farmácias e usuários.
 */
@Service
@RequiredArgsConstructor
public class AdminService {

    private final FarmaciaRepository farmaciaRepository;
    private final UsuarioRepository usuarioRepository;

    /**
     * Busca uma lista paginada de farmácias com um status específico.
     *
     * @param status O status do lojista (String) a ser convertido para {@link LojistaStatus}.
     * @param pageable As informações de paginação.
     * @return Uma página de farmácias.
     * @throws ConflictException Se o status fornecido for inválido.
     */
    @Transactional(readOnly = true)
    public Page<Farmacia> findFarmaciasByStatus(String status, Pageable pageable) {
        try {
            LojistaStatus lojistaStatus = LojistaStatus.valueOf(status.toUpperCase());
            return farmaciaRepository.findByStatus(lojistaStatus, pageable);
        } catch (IllegalArgumentException e) {
            throw new ConflictException("Status '" + status + "' é inválido. Use PENDENTE_APROVACAO, ATIVO ou SUSPENSO.");
        }
    }

    /**
     * Aprova o cadastro de uma farmácia, mudando seu status para ATIVO.
     *
     * @param farmaciaId O ID da farmácia a ser aprovada.
     * @return A {@link Farmacia} atualizada.
     * @throws ResourceNotFoundException Se a farmácia não for encontrada.
     * @throws ConflictException Se o status atual não for PENDENTE_APROVACAO.
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
     * Suspende as operações de uma farmácia ATIVA.
     *
     * @param farmaciaId O ID da farmácia a ser suspensa.
     * @return A {@link Farmacia} atualizada.
     * @throws ResourceNotFoundException Se a farmácia não for encontrada.
     * @throws ConflictException Se o status atual não for ATIVO.
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
     * Reativa uma farmácia SUSPENSA.
     *
     * @param farmaciaId O ID da farmácia a ser reativada.
     * @return A {@link Farmacia} atualizada.
     * @throws ResourceNotFoundException Se a farmácia não for encontrada.
     * @throws ConflictException Se o status atual não for SUSPENSO.
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

    /**
     * Busca um usuário pelo seu e-mail.
     *
     * @param email O e-mail do usuário.
     * @return O objeto {@link Usuario}.
     * @throws ResourceNotFoundException Se o usuário não for encontrado.
     */
    @Transactional(readOnly = true)
    public Usuario findUsuarioByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário com e-mail '" + email + "' não encontrado."));
    }

    /**
     * Ativa ou desativa a conta de um usuário.
     *
     * @param usuarioId O ID do usuário.
     * @param isEnabled O novo estado de habilitação (true para ativo, false para desativado).
     * @return O objeto {@link Usuario} atualizado.
     * @throws ResourceNotFoundException Se o usuário não for encontrado.
     */
    @Transactional
    public Usuario setUsuarioEnabled(Long usuarioId, boolean isEnabled) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário com ID " + usuarioId + " não encontrado."));

        usuario.setEnabled(isEnabled);
        return usuarioRepository.save(usuario);
    }
}