package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.PlayersMatchSquad;
import pl.pollub.footballapp.service.PlayersMatchSquadService;

import java.util.List;

@RestController
@RequestMapping("/api/players-match-squad")
public class PlayersMatchSquadController {

    private final PlayersMatchSquadService playersMatchSquadService;

    @Autowired
    public PlayersMatchSquadController(PlayersMatchSquadService playersMatchSquadService) {
        this.playersMatchSquadService = playersMatchSquadService;
    }

    @PostMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<PlayersMatchSquad> addPlayerToSquad(@RequestBody PlayersMatchSquad player) {
        PlayersMatchSquad savedPlayer = playersMatchSquadService.addPlayerToSquad(player);
        return ResponseEntity.ok(savedPlayer);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<PlayersMatchSquad> getPlayerById(@PathVariable Long id) {
        return playersMatchSquadService.getPlayerById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public List<PlayersMatchSquad> getAllPlayers() {
        return playersMatchSquadService.getAllPlayers();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> deletePlayerById(@PathVariable Long id) {
        playersMatchSquadService.deletePlayerById(id);
        return ResponseEntity.noContent().build();
    }
}
