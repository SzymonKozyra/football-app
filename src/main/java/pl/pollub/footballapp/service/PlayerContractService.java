package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.TransferType;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.model.PlayerContract;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.repository.PlayerContractRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.requests.PlayerContractRequest;

import java.util.List;

@Service
public class PlayerContractService {

    @Autowired
    private PlayerContractRepository playerContractRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    public ResponseEntity<?> addPlayerContract(PlayerContractRequest request) {
        boolean hasActiveContract = playerContractRepository.existsByPlayerIdAndIsActive(request.getPlayerId(), true);

        if (hasActiveContract) {
            return ResponseEntity.badRequest().body("Player already has an active contract.");
        }

        // Check if there is an overlapping contract
        boolean overlappingContractExists = playerContractRepository.findByPlayerId(request.getPlayerId())
                .stream()
                .anyMatch(contract -> (request.getStartDate().isBefore(contract.getEndDate()) || contract.getEndDate() == null)
                        && (request.getEndDate() == null || request.getEndDate().isAfter(contract.getStartDate())));

        if (overlappingContractExists) {
            return ResponseEntity.badRequest().body("Cannot add contract. A contract already exists for the specified date range.");
        }

        // Process contract creation if no conflicts found
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new IllegalArgumentException("Player not found with id: " + request.getPlayerId()));

        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + request.getTeamId()));

        PlayerContract playerContract = new PlayerContract();
        playerContract.setStartDate(request.getStartDate());
        playerContract.setEndDate(request.getEndDate());
        playerContract.setPlayer(player);
        playerContract.setTeam(team);
        playerContract.setSalary(request.getSalary());
        playerContract.setTransferType(request.getTransferType());

        if (request.getTransferType() == TransferType.TRANSFER) {
            playerContract.setTransferFee(request.getTransferFee());
        } else {
            playerContract.setTransferFee(null);
        }

        playerContractRepository.save(playerContract);
        return ResponseEntity.ok("Player contract added successfully");
    }

    public List<PlayerContract> getContractsByPlayer(Long playerId) {
        return playerContractRepository.findByPlayerId(playerId);
    }

    public List<PlayerContract> getContractsByTeam(Long teamId) {
        return playerContractRepository.findByTeamId(teamId);
    }

    public ResponseEntity<PlayerContract> getPlayerContractById(Long id) {
        PlayerContract playerContract = playerContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        return ResponseEntity.ok(playerContract);
    }

    public ResponseEntity<PlayerContract> editPlayerContract(Long id, PlayerContractRequest request) {
        PlayerContract playerContract = playerContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Player player = playerRepository.findById(playerContract.getPlayer().getId())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Team team = teamRepository.findById(playerContract.getTeam().getId())
                .orElseThrow(() -> new RuntimeException("Team not found"));

        playerContract.setPlayer(player);
        playerContract.setTeam(team);
        playerContract.setStartDate(request.getStartDate());
        playerContract.setEndDate(request.getEndDate());
        playerContract.setSalary(request.getSalary());
        playerContract.setTransferFee(request.getTransferFee());
        playerContract.setTransferType(request.getTransferType());

        PlayerContract updatedContract = playerContractRepository.save(playerContract);
        return ResponseEntity.ok(updatedContract);
    }

    public void deletePlayerContract(Long id) {
        if (!playerContractRepository.existsById(id)) {
            throw new IllegalArgumentException("Contract not found with ID: " + id);
        }
        playerContractRepository.deleteById(id);
    }
}
