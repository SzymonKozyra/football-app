package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.requests.LeagueRequest;
import pl.pollub.footballapp.service.LeagueService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/leagues")
@CrossOrigin(origins = "http://localhost:3000")
public class LeagueController {

    @Autowired
    private LeagueService leagueService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addLeague(@RequestBody LeagueRequest leagueRequest) {
        return leagueService.addLeague(leagueRequest);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importLeagues(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            return leagueService.importLeagues(file, fileType);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing leagues: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<League>> searchLeagues(@RequestParam("query") String query) {
        return leagueService.searchLeagues(query);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateLeague(@PathVariable Long id, @RequestBody LeagueRequest updatedLeagueRequest) {
        return leagueService.updateLeague(id, updatedLeagueRequest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteLeague(@PathVariable Long id) {
        return leagueService.deleteLeague(id);
    }

}
