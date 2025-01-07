package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/images/team")
public class TeamImageController {

    private final String uploadDir = "C:/footballapp_files/images/team/";

    @GetMapping("/{filename:.+}")
    @PermitAll
    public ResponseEntity<?> getImage(@PathVariable String filename) {
        try {
            Path path = Paths.get(uploadDir).resolve(filename).normalize();
            System.out.println("Próba dostępu do pliku: " + path.toString());

            // Jeśli plik nie istnieje, zwracamy domyślny obraz
            if (!Files.exists(path)) {
                System.out.println("Plik nie istnieje, używam domyślnego obrazu.");
                path = Paths.get(uploadDir, "team", "default-team.png");
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


    @PostMapping("/upload/{teamId}")
    @RolesAllowed({"ROLE_ADMIN", "ROLE_MODERATOR"}) // Tylko dla administratorów lub moderatorów
    public ResponseEntity<?> uploadImage(@PathVariable Long teamId, @RequestParam("file") MultipartFile file) {
        try {
            // Tworzenie katalogu, jeśli nie istnieje
            Path directoryPath = Paths.get(uploadDir);
            if (!Files.exists(directoryPath)) {
                Files.createDirectories(directoryPath);
            }

            // Sprawdzenie typu pliku
            String fileType = file.getContentType();
            if (!fileType.equals("image/jpeg") && !fileType.equals("image/png")) {
                return ResponseEntity.badRequest().body("Dozwolone są tylko pliki JPEG i PNG.");
            }

            // Zapis pliku
            String extension = fileType.equals("image/png") ? ".png" : ".jpg";
            Path filePath = directoryPath.resolve("team_" + teamId + extension);
            Files.write(filePath, file.getBytes());

            return ResponseEntity.ok("Zdjęcie drużyny zostało przesłane pomyślnie.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Wystąpił błąd podczas przesyłania zdjęcia.");
        }
    }
}
