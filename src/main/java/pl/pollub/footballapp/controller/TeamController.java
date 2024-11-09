package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.requests.TeamRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private ImporterFactory importerFactory;


    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addTeam(@RequestBody TeamRequest teamRequest) {
        League league = leagueRepository.findById(teamRequest.getLeagueId())
                .orElseThrow(() -> new RuntimeException("League not found"));

        // Sprawdzanie duplikatów: nie może być tego samego klubu w jednej lidze
        if (teamRepository.existsByNameAndLeague(teamRequest.getName(), league)) {
            return ResponseEntity.badRequest().body("Team already exists in this league");
        }

        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setPicture(teamRequest.getPicture());
        team.setIsClub(teamRequest.isClub());
        team.setLeague(league);
        teamRepository.save(team);
        return ResponseEntity.ok("Team added successfully");
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importTeams(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            DataImporter importer = importerFactory.getImporterTeam(fileType);
            List<TeamRequest> teamRequests = importer.importData(file.getInputStream());

            for (TeamRequest teamRequest : teamRequests) {
                League league = leagueRepository.findById(teamRequest.getLeagueId())
                        .orElseThrow(() -> new IllegalArgumentException("League not found: " + teamRequest.getLeagueId()));

                // Sprawdzanie duplikatów
                if (!teamRepository.existsByNameAndLeague(teamRequest.getName(), league)) {
                    Team team = new Team();
                    team.setName(teamRequest.getName());
                    team.setPicture(teamRequest.getPicture());
                    team.setIsClub(teamRequest.isClub());
                    team.setLeague(league);

                    //team.setValue(calculateTeamValue(team));

                    teamRepository.save(team);
                }
            }

            return ResponseEntity.ok("Teams imported successfully");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing teams: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody TeamRequest teamRequest) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        // Ensure that the league is fetched from the request's leagueId
        League league = leagueRepository.findById(teamRequest.getLeagueId())
                .orElseThrow(() -> new RuntimeException("League not found"));

        // Update team details
        team.setName(teamRequest.getName());
        team.setPicture(teamRequest.getPicture());
        team.setLeague(league);  // Set the league correctly

        teamRepository.save(team);
        return ResponseEntity.ok("Team updated successfully");
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<Team>> searchTeams(@RequestParam("query") String query) {
        List<Team> teams = teamRepository.findByNameContaining(query);
        return ResponseEntity.ok(teams);
    }



}
