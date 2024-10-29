package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.Position;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.repository.PositionRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.requests.PlayerRequest;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private PositionRepository positionRepository;

    @Autowired
    private TeamRepository teamRepository;

    public void addPlayer(PlayerRequest playerRequest) {
        Player player = new Player();
        player.setFirstName(playerRequest.getFirstName());
        player.setLastName(playerRequest.getLastName());
        player.setDateOfBirth(playerRequest.getDateOfBirth());
        player.setNickname(playerRequest.getNickname());
        player.setPicture(playerRequest.getPicture());
        player.setPosition(positionRepository.findById(playerRequest.getPositionId()).orElseThrow());
        player.setCountry(countryRepository.findById(playerRequest.getCountryId()).orElseThrow());
        if (playerRequest.getClubId() != null) {
            player.setClub(teamRepository.findById(playerRequest.getClubId()).orElseThrow());
        }
        if (playerRequest.getNationalTeamId() != null) {
            player.setNationalTeam(teamRepository.findById(playerRequest.getNationalTeamId()).orElseThrow());
        }
        player.setValue(playerRequest.getValue()); // Set value

        playerRepository.save(player);
    }

    public void updatePlayer(PlayerRequest playerRequest) {
        Player existingPlayer = playerRepository.findById(playerRequest.getId())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Country country = countryRepository.findById(playerRequest.getCountryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid country ID"));

        Position position = positionRepository.findById(playerRequest.getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid position ID"));

        Team club = null;
        if (playerRequest.getClubId() != null) {
            club = teamRepository.findById(playerRequest.getClubId())
                    .filter(Team::isClub)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid club ID or team is not a club"));
        }

        Team nationalTeam = null;
        if (playerRequest.getNationalTeamId() != null) {
            nationalTeam = teamRepository.findById(playerRequest.getNationalTeamId())
                    .filter(team -> !team.isClub())
                    .orElseThrow(() -> new IllegalArgumentException("Invalid national team ID or team is a club"));
        }

        existingPlayer.setFirstName(playerRequest.getFirstName());
        existingPlayer.setLastName(playerRequest.getLastName());
        existingPlayer.setDateOfBirth(playerRequest.getDateOfBirth());
        existingPlayer.setNickname(playerRequest.getNickname());
        existingPlayer.setPicture(playerRequest.getPicture());
        existingPlayer.setCountry(country);
        existingPlayer.setPosition(position);
        existingPlayer.setClub(club);
        existingPlayer.setNationalTeam(nationalTeam);

        playerRepository.save(existingPlayer);
    }

    public void addPlayers(List<PlayerRequest> playerRequests) {
        for (PlayerRequest playerRequest : playerRequests) {
            addPlayer(playerRequest);  // Wywołanie istniejącej metody addPlayer dla każdego gracza
        }
    }

}
