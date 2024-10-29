package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.PlayerRequest;
import pl.pollub.footballapp.service.PlayerService;

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
}
