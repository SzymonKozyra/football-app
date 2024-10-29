package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.PlayerRequest;
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
    private PlayerRepository playerRepository;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addPlayer(@RequestBody PlayerRequest playerRequest) {
        try {
            playerService.addPlayer(playerRequest); // Pass PlayerRequest to the service
            return ResponseEntity.ok("Player added successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updatePlayer(@PathVariable Long id, @RequestBody PlayerRequest updatedPlayer) {
        Player player = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found"));
        updatedPlayer.setId(id); // Ustawiamy id dla aktualizowanego gracza
        playerService.updatePlayer(updatedPlayer);
        return ResponseEntity.ok("Player updated successfully");
    }

    @GetMapping("/search")
    public ResponseEntity<List<Player>> searchPlayers(@RequestParam("query") String query) {
        List<Player> players = playerRepository.findByFirstNameContainingOrLastNameContaining(query, query);
        return ResponseEntity.ok(players);
    }

    @Autowired
    private ImporterFactory importerFactory;

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importPlayers(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            DataImporter importer = importerFactory.getImporterPlayer(fileType);
            List<PlayerRequest> playerRequests = importer.importData(file.getInputStream());

            playerService.addPlayers(playerRequests);
            return ResponseEntity.ok("Players imported successfully");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing players: " + e.getMessage());
        }
    }
}
