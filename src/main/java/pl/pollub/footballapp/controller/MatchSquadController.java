package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.service.MatchSquadService;

import java.util.List;

@RestController
@RequestMapping("/api/match-squads")
public class MatchSquadController {

    private final MatchSquadService matchSquadService;

    @Autowired
    public MatchSquadController(MatchSquadService matchSquadService) {
        this.matchSquadService = matchSquadService;
    }

    @PostMapping
    public MatchSquad createMatchSquad(@RequestBody MatchSquad matchSquad) {
        return matchSquadService.saveMatchSquad(matchSquad);
    }

    @GetMapping
    public List<MatchSquad> getAllMatchSquads() {
        return matchSquadService.getAllMatchSquads();
    }

    @GetMapping("/{id}")
    public MatchSquad getMatchSquadById(@PathVariable Long id) {
        return matchSquadService.getMatchSquadById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteMatchSquad(@PathVariable Long id) {
        matchSquadService.deleteMatchSquad(id);
    }
}
