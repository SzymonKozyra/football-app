package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.requests.PlayerRequest;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.service.PlayerService;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerService playerService;

    @Autowired
    private ImporterFactory importerFactory;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addPlayer(@RequestBody PlayerRequest playerRequest) {
        try {
            playerService.addPlayer(playerRequest);
            return ResponseEntity.ok("Player added successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updatePlayer(@PathVariable Long id, @RequestBody PlayerRequest updatedPlayer) {
        try {
            playerService.updatePlayer(id, updatedPlayer);
            return ResponseEntity.ok("Player updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Player>> searchPlayers(@RequestParam("query") String query) {
        List<Player> players = playerService.searchPlayers(query);
        return ResponseEntity.ok(players);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importPlayers(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            DataImporter importer = importerFactory.getImporterPlayer(fileType);
            List<PlayerRequest> playerRequests = importer.importData(file.getInputStream());

            String message = playerService.addPlayers(playerRequests);
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing players: " + e.getMessage());
        }
    }
}
