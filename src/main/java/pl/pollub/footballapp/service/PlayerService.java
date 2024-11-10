package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.Position;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.repository.PositionRepository;
import pl.pollub.footballapp.requests.PlayerRequest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PlayerService {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private PositionRepository positionRepository;

    public void addPlayer(PlayerRequest playerRequest) {
        Player player = createPlayerFromRequest(playerRequest);
        playerRepository.save(player);
    }

    public void updatePlayer(Long id, PlayerRequest playerRequest) {
        Player existingPlayer = playerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Player updatedPlayer = createPlayerFromRequest(playerRequest);
        updatedPlayer.setId(existingPlayer.getId()); // retain existing ID
        playerRepository.save(updatedPlayer);
    }

    public List<Player> searchPlayers(String query) {
        return playerRepository.findByFirstNameContainingOrLastNameContaining(query, query);
    }

    public String addPlayers(List<PlayerRequest> playerRequests) {
        List<Integer> duplicateRows = new ArrayList<>();
        int rowNumber = 1;

        for (PlayerRequest playerRequest : playerRequests) {
            boolean isDuplicate = playerRepository.existsByFirstNameAndLastNameAndDateOfBirthAndCountryId(
                    playerRequest.getFirstName(),
                    playerRequest.getLastName(),
                    playerRequest.getDateOfBirth(),
                    playerRequest.getCountryId()
            );

            if (!isDuplicate) {
                addPlayer(playerRequest);
            } else {
                duplicateRows.add(rowNumber);
            }

            rowNumber++;
        }

        if (!duplicateRows.isEmpty()) {
            return "Players imported successfully. The following records were not added due to duplicates: " + duplicateRows;
        } else {
            return "Players imported successfully.";
        }
    }

    private Player createPlayerFromRequest(PlayerRequest playerRequest) {
        validateRequest(playerRequest);

        Player player = new Player();
        player.setFirstName(playerRequest.getFirstName());
        player.setLastName(playerRequest.getLastName());
        player.setDateOfBirth(playerRequest.getDateOfBirth());
        player.setNickname(playerRequest.getNickname());
        player.setPicture(playerRequest.getPicture());
        player.setValue(playerRequest.getValue() != null ? playerRequest.getValue() : BigDecimal.ZERO);

        Country country = countryRepository.findById(playerRequest.getCountryId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Country ID."));
        player.setCountry(country);

        Position position = positionRepository.findById(playerRequest.getPositionId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid Position ID."));
        player.setPosition(position);

        return player;
    }

    private void validateRequest(PlayerRequest playerRequest) {
        if (playerRequest.getCountryId() == null) {
            throw new IllegalArgumentException("Country ID is required.");
        }
        if (playerRequest.getPositionId() == null) {
            throw new IllegalArgumentException("Position ID is required.");
        }
    }
}
