package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.service.TeamService;
import pl.pollub.footballapp.service.PlayerService;
import pl.pollub.footballapp.service.CoachService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final TeamService teamService;
    private final PlayerService playerService;
    private final CoachService coachService;

    @Autowired
    public SearchController(TeamService teamService, PlayerService playerService, CoachService coachService) {
        this.teamService = teamService;
        this.playerService = playerService;
        this.coachService = coachService;
    }

    @GetMapping
    public ResponseEntity<Map<String, List<?>>> search(@RequestParam("query") String query) {
        Map<String, List<?>> results = new HashMap<>();
        results.put("teams", teamService.searchTeamsByName(query));
        results.put("players", playerService.searchPlayersByName(query));
        results.put("coaches", coachService.searchCoachesByName(query));
        return ResponseEntity.ok(results);
    }
}
