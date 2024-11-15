package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.requests.TeamRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private ImporterFactory importerFactory;

    @Autowired
    private FileStorageService fileStorageService;

    public String addTeam(TeamRequest teamRequest) {
        League league = leagueRepository.findById(teamRequest.getLeagueId())
                .orElseThrow(() -> new RuntimeException("League not found"));

        if (teamRepository.existsByNameAndLeague(teamRequest.getName(), league)) {
            throw new IllegalArgumentException("Team already exists in this league");
        }

        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setPicture(teamRequest.getPicture());
        team.setIsClub(teamRequest.isClub());
        team.setLeague(league);

        teamRepository.save(team);
        return "Team added successfully";
    }


    public ResponseEntity<?> importTeams(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterTeam(fileType);
        List<TeamRequest> teamRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateRows = new ArrayList<>();
        int rowNumber = 1;

        for (TeamRequest teamRequest : teamRequests) {
            League league = leagueRepository.findById(teamRequest.getLeagueId())
                    .orElseThrow(() -> new RuntimeException("League not found: " + teamRequest.getLeagueId()));

            // Check for duplicate by name and league
            boolean isDuplicate = teamRepository.existsByNameAndLeague(teamRequest.getName(), league);

            if (!isDuplicate) {
                Team team = new Team();
                team.setName(teamRequest.getName());
                team.setIsClub(teamRequest.isClub());
                team.setLeague(league);

                teamRepository.save(team);
            } else {
                duplicateRows.add(rowNumber);
            }
            rowNumber++;
        }

        String message = "Teams imported successfully.";
        if (!duplicateRows.isEmpty()) {
            message += " The following records were not added due to duplicates: " + duplicateRows;
        }

        return ResponseEntity.ok(message);
    }

    public String updateTeam(Long id, TeamRequest teamRequest) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        League league = leagueRepository.findById(teamRequest.getLeagueId())
                .orElseThrow(() -> new RuntimeException("League not found"));

        team.setName(teamRequest.getName());
        team.setPicture(teamRequest.getPicture());
        team.setLeague(league);

        teamRepository.save(team);
        return "Team updated successfully";
    }

    public List<Team> searchTeams(String query) {
        Sort sortById = Sort.by(Sort.Direction.ASC, "id");
        String normalizedQuery = query.trim().toLowerCase();
        return teamRepository.findByNameContaining(normalizedQuery, sortById);
    }

    public String addTeamAndGetId(TeamRequest teamRequest, MultipartFile picture) throws IOException {
        Team team = new Team();
        team.setName(teamRequest.getName());
        team.setIsClub(teamRequest.isClub());

        // Set league if provided
        if (teamRequest.getLeagueId() != null) {
            Optional<League> league = leagueRepository.findById(teamRequest.getLeagueId());
            league.ifPresent(team::setLeague);
        }

        team = teamRepository.save(team);  // Save to generate ID

        // Save the picture if provided
        if (picture != null) {
            String photoPath = fileStorageService.saveImage(picture, "team_" + team.getId(), "team");
            team.setPicture(photoPath);
            teamRepository.save(team);  // Save again to update with picture path
        }

        return "Team added successfully";
    }

    public String updateTeam(Long id, TeamRequest teamRequest, MultipartFile picture) throws IOException {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        League league = leagueRepository.findById(teamRequest.getLeagueId())
                .orElseThrow(() -> new RuntimeException("League not found"));

        team.setName(teamRequest.getName());
        team.setLeague(league);
        team.setIsClub(teamRequest.isClub());

        // Update picture if new one is provided
        if (picture != null) {
            String photoPath = fileStorageService.saveImage(picture, "team_" + id,"team");
            team.setPicture(photoPath);
        }

        teamRepository.save(team);
        return "Team updated successfully";
    }

    @Transactional

    public void deleteTeamById(Long teamId) {
        if (!teamRepository.existsById(teamId)) {
            throw new IllegalArgumentException("Team not found with ID: " + teamId);
        }
        teamRepository.deleteById(teamId);
    }

    public List<Team> getAllTeams() {
        return teamRepository.findAll();
    }
}
