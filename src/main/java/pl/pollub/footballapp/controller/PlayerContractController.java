package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.TransferType;
import pl.pollub.footballapp.model.*;

import pl.pollub.footballapp.repository.PlayerContractRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.requests.CoachContractRequest;
import pl.pollub.footballapp.requests.PlayerContractRequest;

import java.util.List;

@RestController
@RequestMapping("/api/player-contracts")
public class PlayerContractController {

    @Autowired
    private PlayerContractRepository playerContractRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TeamRepository teamRepository;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addPlayerContract(@RequestBody PlayerContractRequest request) {

//        if (coachContractRepository.findByCoachIdAndEndDateIsNull(request.getCoachId()).isPresent()) {
//            return ResponseEntity.badRequest().body("Coach already has an active contract.");
//        }
        boolean hasActiveContract = playerContractRepository.existsByPlayerIdAndIsActive(request.getPlayerId(), true);

        if (hasActiveContract) {
            return ResponseEntity.badRequest().body("Player already has an active contract.");
        }

        // Pobieranie obiektu Player na podstawie ID
        Player player = playerRepository.findById(request.getPlayerId())
                .orElseThrow(() -> new IllegalArgumentException("Coach not found with id: " + request.getPlayerId()));

        // Pobieranie obiektu Team na podstawie ID
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + request.getTeamId()));

        PlayerContract playerContract = new PlayerContract();
        playerContract.setStartDate(request.getStartDate());
        playerContract.setEndDate(request.getEndDate());
        playerContract.setPlayer(player);
        playerContract.setTeam(team);
        playerContract.setSalary(request.getSalary());
//        playerContract.setTransferFee(request.getTransferFee());
//        playerContract.setTransferType(request.getTransferType());
        playerContract.setTransferType(request.getTransferType());

        // Ustaw transferFee tylko wtedy, gdy transferType to TRANSFER_FEE
        if (request.getTransferType() == TransferType.TRANSFER) {
            playerContract.setTransferFee(request.getTransferFee());
        } else {
            playerContract.setTransferFee(null);  // ustaw na null dla innych typów transferu
        }
        playerContractRepository.save(playerContract);
        return ResponseEntity.ok("Player contract added successfully");
    }

    @GetMapping("/player/{playerId}")
    @PreAuthorize("hasRole('MODERATOR')")
    public List<PlayerContract> getContractsByPlayer(@PathVariable Long playerId) {
        return playerContractRepository.findByPlayerId(playerId);
    }

    @GetMapping("/team/{teamId}")
    @PreAuthorize("hasRole('MODERATOR')")
    public List<PlayerContract> getContractsByTeam(@PathVariable Long teamId) {
        return playerContractRepository.findByTeamId(teamId);
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<PlayerContract> getPlayerContractById(@PathVariable Long id) {
        PlayerContract playerContract = playerContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        return ResponseEntity.ok(playerContract);
    }



    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<PlayerContract> editPlayerContract(@PathVariable Long id, @RequestBody PlayerContractRequest request) {

        if (id == null) {
            throw new IllegalArgumentException("Contract ID must not be null");
        }

        PlayerContract playerContract = playerContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Player player = playerRepository.findById(playerContract.getPlayer().getId())
                .orElseThrow(() -> new RuntimeException("Coach not found"));

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



//    @PutMapping("/edit/{id}")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public PlayerContract updatePlayerContract(@PathVariable Long id, @RequestBody PlayerContractRequest request) {
//        PlayerContract playerContract = playerContractRepository.findById(id).orElseThrow();
//        playerContract.setStartDate(request.getStartDate());
//        playerContract.setEndDate(request.getEndDate());
//        playerContract.setSalary(request.getSalary());
//        playerContract.setTransferFee(request.getTransferFee());
//        playerContractRepository.save(playerContract);
//        return playerContract;
//    }
}
