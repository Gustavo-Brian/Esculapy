package ucb.app.esculapy.service;

import org.springframework.web.multipart.MultipartFile;

/**
 * Interface para serviços de armazenamento de arquivos (ex: local, S3).
 */
public interface StorageService {

    /**
     * Prepara o serviço de storage (ex: cria a pasta de uploads).
     */
    void init();

    /**
     * Faz o upload de um arquivo e retorna a URL pública/caminho.
     *
     * @param file O arquivo enviado na requisição
     * @return A URL/caminho onde o arquivo pode ser acessado
     */
    String upload(MultipartFile file);
}