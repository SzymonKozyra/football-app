package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/images/player")
public class PlayerImageController {

    private final String uploadDir = "C:/footballapp_files/images/player/";

    @GetMapping("/{filename:.+}")
    @PermitAll
    public ResponseEntity<?> getImage(@PathVariable String filename) {
        try {
            Path path = Paths.get(uploadDir).resolve(filename).normalize();
            System.out.println("Próba dostępu do pliku: " + path.toString());

            if (!Files.exists(path)) {
                System.out.println("Plik nie istnieje!");
                return ResponseEntity.status(404).body("Plik nie istnieje!");
            }

            Resource resource = new UrlResource(path.toUri());
            return ResponseEntity.ok()
                    .header("Content-Type", Files.probeContentType(path))
                    .body(resource);
        } catch (Exception e) {
            System.out.println("Błąd podczas ładowania pliku: " + e.getMessage());
            return ResponseEntity.status(500).body("Błąd serwera");
        }
    }
}
