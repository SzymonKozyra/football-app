package pl.pollub.footballapp.service;

import org.springframework.stereotype.Service;
import net.coobird.thumbnailator.Thumbnails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    public String saveImage(MultipartFile file, String filename, String dir) throws IOException {
        // Tworzenie katalogu jeśli nie istnieje
        Path directoryPath = Paths.get(uploadDir, dir);
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath);
        }

        // Rozszerzenie pliku
        String extension = file.getContentType().equals("image/png") ? ".png" : ".jpg";
        Path filePath = directoryPath.resolve(filename + extension);

        // Zmiana rozmiaru obrazu i zapis
        Thumbnails.of(file.getInputStream())
                .size(200, 200)
                .outputFormat(file.getContentType().equals("image/png") ? "png" : "jpg")
                .toFile(filePath.toFile());

        return filePath.toString(); // Zwracamy pełną ścieżkę do pliku
    }

    public Resource loadImageAsResource(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();

        // Diagnostyka: wypisanie zawartości katalogu
        System.out.println("Pliki w katalogu: " + filePath.getParent().toString());
        File folder = filePath.getParent().toFile();
        for (File f : folder.listFiles()) {
            System.out.println(f.getName());
        }

        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("File not found: " + filename);
        }
        return resource;
    }

}
