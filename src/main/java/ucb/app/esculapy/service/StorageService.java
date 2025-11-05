package ucb.app.esculapy.service;

import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Faz o upload de um arquivo e retorna a URL pública.
     * @param file O arquivo enviado na requisição
     * @return A URL onde o arquivo pode ser acessado
     */
    String upload(MultipartFile file);
}