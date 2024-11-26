package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.requests.PlayerRequest;
import pl.pollub.footballapp.requests.TeamRequest;
import pl.pollub.footballapp.service.TeamService;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamService teamService;

//    @PostMapping("/add")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<?> addTeam(@RequestBody TeamRequest teamRequest) {
//        try {
//            String result = teamService.addTeam(teamRequest);
//            return ResponseEntity.ok(result);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addTeam(
            @RequestParam("name") String name,
            @RequestParam("isClub") boolean isClub,
            @RequestParam("leagueId") Long leagueId,
            @RequestParam(value = "picture", required = false) MultipartFile picture) {
        System.out.println("Received name: " + name);
        System.out.println("Received isClub: " + isClub);
        System.out.println("Received leagueId: " + leagueId);
        System.out.println("Received picture: " + (picture != null ? picture.getOriginalFilename() : "No picture uploaded"));

        try {
            TeamRequest teamRequest = new TeamRequest(name, isClub, leagueId);
            String message = teamService.addTeamAndGetId(teamRequest, picture);
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving picture: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateTeam(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("isClub") boolean isClub,
            @RequestParam("leagueId") Long leagueId,
            @RequestParam(value = "picture", required = false) MultipartFile picture) {
        try {
            TeamRequest teamRequest = new TeamRequest(name, isClub, leagueId);
            String message = teamService.updateTeam(id, teamRequest, picture);
            return ResponseEntity.ok(message);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error saving picture: " + e.getMessage());
        }
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importTeams(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            return teamService.importTeams(file, fileType);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing teams: " + e.getMessage());
        }
    }

//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody TeamRequest teamRequest) {
//        try {
//            String result = teamService.updateTeam(id, teamRequest);
//            return ResponseEntity.ok(result);
//        } catch (RuntimeException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<Team>> searchTeams(@RequestParam("query") String query) {
        List<Team> teams = teamService.searchTeams(query);
        return ResponseEntity.ok(teams);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        try {
            teamService.deleteTeamById(id);
            return ResponseEntity.ok("Team deleted successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting team: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'MODERATOR','ADMIN')")
    public ResponseEntity<List<Team>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }
}
