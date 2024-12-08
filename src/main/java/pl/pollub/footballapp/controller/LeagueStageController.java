package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.LeagueStage;
import pl.pollub.footballapp.service.LeagueStageService;

import java.util.List;

@RestController
@RequestMapping("/api/leagueStages")
@CrossOrigin(origins = "http://localhost:3000")
public class LeagueStageController {

    @Autowired
    private LeagueStageService leagueStageService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<LeagueStage> addLeagueStage(@RequestBody LeagueStage leagueStage) {
        return ResponseEntity.ok(leagueStageService.saveLeagueStage(leagueStage));
    }

    @GetMapping
    public ResponseEntity<List<LeagueStage>> getAllStages() {
        return ResponseEntity.ok(leagueStageService.getAllStages());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeagueStage> getStageById(@PathVariable Long id) {
        return leagueStageService.getStageById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<Void> deleteStage(@PathVariable Long id) {
        leagueStageService.deleteStage(id);
        return ResponseEntity.ok().build();
    }
}
