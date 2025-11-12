package ucb.app.esculapy.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.exception.ConflictException; // <-- REFATORADO

/**
 * Implementação MOCK (simulada) de um serviço de storage.
 * Não faz upload real, apenas loga e retorna uma URL falsa.
 * Perfeito para desenvolvimento antes de configurar o S3.
 */
@Service
public class MockStorageService implements StorageService {

    private static final Logger log = LoggerFactory.getLogger(MockStorageService.class);

    @Override
    public String upload(MultipartFile file) {
        // REFATORADO: Enviar um arquivo vazio é um Conflito (409) ou Bad Request (400)
        // Não é Forbidden (403)
        if (file.isEmpty()) {
            throw new ConflictException("Arquivo vazio não pode ser enviado.");
        }

        String originalFilename = file.getOriginalFilename();

        log.info("INICIANDO UPLOAD (SIMULADO) DE ARQUIVO: " + originalFilename);

        try {
            Thread.sleep(500); // Simula o tempo de upload
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        log.info("UPLOAD (SIMULADO) CONCLUÍDO.");

        return "https://fake-storage.com/uploads/receitas/" + System.currentTimeMillis() + "_" + originalFilename;
    }
}