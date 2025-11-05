package ucb.app.esculapy.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.exception.ForbiddenException;

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
        if (file.isEmpty()) {
            throw new ForbiddenException("Arquivo vazio não pode ser enviado.");
        }

        String originalFilename = file.getOriginalFilename();

        // Simula o upload
        log.info("INICIANDO UPLOAD (SIMULADO) DE ARQUIVO: " + originalFilename);

        // Simula o tempo de upload
        try {
            Thread.sleep(500); // Meio segundo
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        log.info("UPLOAD (SIMULADO) CONCLUÍDO.");

        // Retorna uma URL falsa
        return "https://fake-storage.com/uploads/receitas/" + System.currentTimeMillis() + "_" + originalFilename;
    }
}