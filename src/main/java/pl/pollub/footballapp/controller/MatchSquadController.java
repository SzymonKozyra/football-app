package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.service.MatchSquadService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/match-squad")
public class MatchSquadController {

    private final MatchSquadService matchSquadService;

    @Autowired
    public MatchSquadController(MatchSquadService matchSquadService) {
        this.matchSquadService = matchSquadService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<MatchSquad> addMatchSquad(@RequestBody MatchSquad matchSquad) {
        return ResponseEntity.ok(matchSquadService.addMatchSquad(matchSquad));
    }

    @GetMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<MatchSquad>> getAllMatchSquads() {
        return ResponseEntity.ok(matchSquadService.getAllMatchSquads());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<MatchSquad> getMatchSquadById(@PathVariable Long id) {
        Optional<MatchSquad> matchSquad = matchSquadService.getMatchSquadById(id);
        return matchSquad.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteMatchSquad(@PathVariable Long id) {
        matchSquadService.deleteMatchSquad(id);
        return ResponseEntity.ok().build();
    }
}
