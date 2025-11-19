package ucb.app.esculapy.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ucb.app.esculapy.exception.ConflictException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * Implementação de {@link StorageService} que armazena arquivos localmente no sistema de arquivos.
 */
@Service
public class FileSystemStorageService implements StorageService {

    private final Path rootLocation;

    /**
     * Inicializa o serviço definindo o diretório raiz como 'uploads'.
     */
    public FileSystemStorageService() {
        this.rootLocation = Paths.get("uploads");
    }

    /**
     * Cria o diretório raiz de uploads se ele não existir.
     *
     * @throws RuntimeException Se não for possível inicializar o diretório.
     */
    @Override
    public void init() {
        try {
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o diretório de storage", e);
        }
    }

    /**
     * Faz o upload de um arquivo, renomeando-o com um UUID e salva no diretório raiz.
     *
     * @param file O arquivo enviado na requisição.
     * @return O caminho absoluto do arquivo salvo no sistema de arquivos local.
     * @throws ConflictException Se o arquivo estiver vazio.
     * @throws RuntimeException Se houver falha ao salvar o arquivo.
     */
    @Override
    public String upload(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ConflictException("Arquivo vazio não pode ser enviado.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            Path destinationFile = this.rootLocation.resolve(Paths.get(filename))
                    .normalize().toAbsolutePath();

            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);

            return destinationFile.toString();

        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar o arquivo.", e);
        }
    }
}