package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.service.TeamGroupMembershipService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/teamGroupMembership")
@CrossOrigin(origins = "http://localhost:3000")
public class TeamGroupMembershipController {

    @Autowired
    private TeamGroupMembershipService membershipService;

    @PostMapping("/group/{groupId}/assign") // Poprawiono mapowanie
    public ResponseEntity<String> assignTeamsToGroup(@PathVariable Long groupId, @RequestBody List<Long> teamIds) {
        membershipService.assignTeamsToGroup(groupId, teamIds);
        return ResponseEntity.ok("Teams assigned to group successfully");
    }

    @GetMapping("/group/{groupId}/points") // Poprawiono mapowanie
    public ResponseEntity<Map<String, Integer>> getGroupPoints(@PathVariable Long groupId) {
        Map<Team, Integer> points = membershipService.calculateGroupPoints(groupId);
        Map<String, Integer> response = points.entrySet().stream()
                .collect(Collectors.toMap(
                        entry -> entry.getKey().getName(),
                        Map.Entry::getValue
                ));
        return ResponseEntity.ok(response);
    }
}