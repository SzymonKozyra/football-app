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
        File directory = new File(uploadDir+"/"+dir);
        if (!directory.exists()) {
            directory.mkdirs();
        }

        String extension = file.getContentType().equals("image/png") ? ".png" : ".jpg";
        File outputFile = new File(directory, filename + extension);
        Thumbnails.of(file.getInputStream())
                .size(200, 200)
                .outputFormat(file.getContentType().equals("image/png") ? "png" : "jpg")
                .toFile(outputFile);

        return "/img/player/" + filename + extension;
    }

    public Resource loadImageAsResource(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        Resource resource = new UrlResource(filePath.toUri());

        if (!resource.exists()) {
            throw new RuntimeException("File not found: " + filename);
        }
        return resource;
    }
}
