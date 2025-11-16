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
 * Implementação "Real" do StorageService que salva os arquivos
 * em uma pasta local chamada 'uploads'.
 */
@Service
public class FileSystemStorageService implements StorageService {

    private final Path rootLocation;

    public FileSystemStorageService() {
        // Define o diretório de upload na raiz do projeto
        this.rootLocation = Paths.get("uploads");
    }

    @Override
    public void init() {
        try {
            // Cria o diretório 'uploads' se ele não existir
            Files.createDirectories(rootLocation);
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível inicializar o diretório de storage", e);
        }
    }

    @Override
    public String upload(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ConflictException("Arquivo vazio não pode ser enviado.");
        }

        try (InputStream inputStream = file.getInputStream()) {
            // Gera um nome de arquivo único para evitar conflitos
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String filename = UUID.randomUUID().toString() + extension;

            // Salva o arquivo no disco
            Path destinationFile = this.rootLocation.resolve(Paths.get(filename))
                    .normalize().toAbsolutePath();

            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);

            // Em um app real, retornaríamos a URL completa (ex: http://meusite.com/uploads/arquivo.pdf)
            // Por enquanto, retornamos o caminho relativo.
            return destinationFile.toString();

        } catch (IOException e) {
            throw new RuntimeException("Falha ao salvar o arquivo.", e);
        }
    }
}