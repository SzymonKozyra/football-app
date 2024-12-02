package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.LeagueGroup;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.TeamGroupMembership;
import pl.pollub.footballapp.repository.LeagueGroupRepository;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.TeamGroupMembershipRepository;
import pl.pollub.footballapp.repository.TeamRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TeamGroupMembershipService {

    @Autowired
    private TeamGroupMembershipRepository membershipRepository;

    @Autowired
    private LeagueGroupRepository leagueGroupRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Autowired
    private TeamRepository teamRepository;

    public void assignTeamsToGroup(Long groupId, List<Long> teamIds) {
        LeagueGroup group = leagueGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<Team> teams = teamRepository.findAllById(teamIds);

        for (Team team : teams) {
            TeamGroupMembership membership = new TeamGroupMembership(team, group);
            membershipRepository.save(membership);
        }
    }

    public Map<Team, Integer> calculateGroupPoints(Long groupId) {
        LeagueGroup group = leagueGroupRepository.findById(groupId)
                .orElseThrow(() -> new RuntimeException("Group not found"));

        List<TeamGroupMembership> memberships = membershipRepository.findByGroup(group);
        Map<Team, Integer> points = new HashMap<>();

        for (TeamGroupMembership membership : memberships) {
            Team team = membership.getTeam();
            List<Match> matches = matchRepository.findByGroupAndHomeTeamOrGroupAndAwayTeam(group, team, group, team);

            int teamPoints = 0;
            for (Match match : matches) {
                if (match.getHomeTeam().equals(team)) {
                    teamPoints += calculatePoints(match.getHomeGoals(), match.getAwayGoals());
                } else if (match.getAwayTeam().equals(team)) {
                    teamPoints += calculatePoints(match.getAwayGoals(), match.getHomeGoals());
                }
            }
            points.put(team, teamPoints);
        }
        return points;
    }

    private int calculatePoints(int teamGoals, int opponentGoals) {
        if (teamGoals > opponentGoals) return 3; // Wygrana
        if (teamGoals == opponentGoals) return 1; // Remis
        return 0; // Przegrana
    }
}
