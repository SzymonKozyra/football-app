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
        if (playerRequest.getCountryId() == null) {
            throw new IllegalArgumentException("Country ID is required.");
        }
        if (playerRequest.getPositionId() == null) {
            throw new IllegalArgumentException("Position ID is required.");
        }

        Player player = new Player();
        player.setFirstName(playerRequest.getFirstName());
        player.setLastName(playerRequest.getLastName());
        player.setDateOfBirth(playerRequest.getDateOfBirth());

        if (playerRequest.getNickname() != null) {
            player.setNickname(playerRequest.getNickname());
        }
        if (playerRequest.getPicture() != null) {
            player.setPicture(playerRequest.getPicture());
        }

        player.setPosition(positionRepository.findById(playerRequest.getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Position ID.")));

        player.setCountry(countryRepository.findById(playerRequest.getCountryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Country ID.")));

        if (playerRequest.getClubId() != null) {
            player.setClub(teamRepository.findById(playerRequest.getClubId()).orElse(null));
        }
        if (playerRequest.getNationalTeamId() != null) {
            player.setNationalTeam(teamRepository.findById(playerRequest.getNationalTeamId()).orElse(null));
        }

        player.setValue(playerRequest.getValue() != null ? playerRequest.getValue() : BigDecimal.ZERO);
        playerRepository.save(player);
    }

    public void updatePlayer(PlayerRequest playerRequest) {
        Player existingPlayer = playerRepository.findById(playerRequest.getId())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        if (playerRequest.getCountryId() == null) {
            throw new IllegalArgumentException("Country ID is required.");
        }
        if (playerRequest.getPositionId() == null) {
            throw new IllegalArgumentException("Position ID is required.");
        }

        existingPlayer.setFirstName(playerRequest.getFirstName());
        existingPlayer.setLastName(playerRequest.getLastName());
        existingPlayer.setDateOfBirth(playerRequest.getDateOfBirth());

        if (playerRequest.getNickname() != null) {
            existingPlayer.setNickname(playerRequest.getNickname());
        }
        if (playerRequest.getPicture() != null) {
            existingPlayer.setPicture(playerRequest.getPicture());
        }

        existingPlayer.setCountry(countryRepository.findById(playerRequest.getCountryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Country ID.")));

        existingPlayer.setPosition(positionRepository.findById(playerRequest.getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Position ID.")));

        if (playerRequest.getClubId() != null) {
            existingPlayer.setClub(teamRepository.findById(playerRequest.getClubId()).orElse(null));
        }
        if (playerRequest.getNationalTeamId() != null) {
            existingPlayer.setNationalTeam(teamRepository.findById(playerRequest.getNationalTeamId()).orElse(null));
        }

        if (playerRequest.getValue() != null) {
            existingPlayer.setValue(playerRequest.getValue());
        }

        playerRepository.save(existingPlayer);
    }

    public void addPlayers(List<PlayerRequest> playerRequests) {
        for (PlayerRequest playerRequest : playerRequests) {
            addPlayer(playerRequest);
        }
    }
}
