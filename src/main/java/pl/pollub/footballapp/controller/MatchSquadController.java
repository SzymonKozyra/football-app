package pl.pollub.footballapp.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.requests.MatchSquadRequest;
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

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private MatchRepository matchRepository;
    private static final Logger log = LoggerFactory.getLogger(MatchSquadService.class);

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<MatchSquad> addMatchSquad(@RequestBody MatchSquadRequest request) {
        Match match = matchRepository.findById(request.getMatchId())
                .orElseThrow(() -> new IllegalArgumentException("Match not found for ID: " + request.getMatchId()));

        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new IllegalArgumentException("Player not found for ID: " + request.getPlayerId()));

        MatchSquad matchSquad = new MatchSquad();
        matchSquad.setMatch(match); // Ustawienie pełnego obiektu meczu
        matchSquad.setPlayer(player); // Ustawienie pełnego obiektu zawodnika
        matchSquad.setHomeTeam(request.getHomeTeam());
        matchSquad.setFirstSquad(request.getFirstSquad());

        MatchSquad savedMatchSquad = matchSquadService.addMatchSquad(matchSquad);
        return ResponseEntity.ok(savedMatchSquad);
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

    @GetMapping("/players/{matchId}")
    public ResponseEntity<List<Player>> getPlayersByMatchId(@PathVariable Long matchId) {
        log.debug("Received request for players in matchId: {}", matchId);
        List<Player> players = matchSquadService.getPlayersByMatchId(matchId);
        log.debug("Returning players: {}", players);
        return ResponseEntity.ok(players);
    }

    @GetMapping("/first-squad/{matchId}")
    public ResponseEntity<List<Player>> getFirstSquadPlayers(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchSquadService.getFirstSquadPlayers(matchId));
    }

    @GetMapping("/substitutes/{matchId}")
    public ResponseEntity<List<Player>> getSubstitutePlayers(@PathVariable Long matchId) {
        return ResponseEntity.ok(matchSquadService.getSubstitutePlayers(matchId));
    }
}
