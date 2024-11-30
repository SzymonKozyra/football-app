package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.PlayerContract;
import pl.pollub.footballapp.service.LeagueService;
import pl.pollub.footballapp.service.MatchService;
import pl.pollub.footballapp.service.RefereeService;
import pl.pollub.footballapp.service.StadiumService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/matches")
public class MatchController {
    private final MatchService matchService;

    @Autowired
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Long> addMatch(@RequestBody Match match) {
        Match savedMatch = matchService.saveMatch(match);
        return ResponseEntity.ok(savedMatch.getId());
    }

    @GetMapping
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<Match>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Match> getMatchById(@PathVariable Long id) {
        return matchService.getMatchById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match match) {
//        return ResponseEntity.ok(matchService.updateMatch(id, match));
//    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteMatch(@PathVariable Long id) {
        matchService.deleteMatch(id);
        return ResponseEntity.ok().build();
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Match> updateMatch(@PathVariable Long id, @RequestBody Match updatedMatch) {
        return ResponseEntity.ok(matchService.updateMatch(id, updatedMatch));
    }

//    @GetMapping
//    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN')")
//    public ResponseEntity<List<Match>> getAllMatches() {
//        return ResponseEntity.ok(matchService.getAllMatches());
//    }

//    @GetMapping("/search")
//    public ResponseEntity<List<Match>> searchMatches(@RequestParam String teamName) {
//        List<Match> matches = matchService.findMatchesByTeamName(teamName);
//        return ResponseEntity.ok(matches);
//    }

//    @GetMapping("/search")
//    public ResponseEntity<List<Match>> searchMatches(@RequestParam String query) {
//        List<Match> matches = matchService.searchMatchesByTeamName(query);
//        return ResponseEntity.ok(matches);
//    }

    @GetMapping("/search")
    public ResponseEntity<List<Match>> searchMatches(@RequestParam String query) {
        List<Match> matches = matchService.searchMatchesByTeamName(query);
        return ResponseEntity.ok(matches);
    }

//    @GetMapping("/team/{teamId}")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public List<Match> getMatchesByTeam(@PathVariable Long teamId) {
//        return matchService.getMatchesByTeamName(teamId);
//    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Match>> getMatchesByDate(
            @PathVariable("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<Match> matches = matchService.getMatchesByDate(date);
        return ResponseEntity.ok(matches);
    }
}
