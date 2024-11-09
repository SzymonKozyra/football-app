package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.PlayerRepository;

import pl.pollub.footballapp.requests.InjuryRequest;
import pl.pollub.footballapp.repository.InjuryRepository;
import pl.pollub.footballapp.model.Injury;


import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/injuries")
public class InjuryController {

    @Autowired
    private InjuryRepository injuryRepository;

    @Autowired
    private PlayerRepository playerRepository;


    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addInjury(@RequestBody InjuryRequest injuryRequest) {
        Optional<Player> player = playerRepository.findById(injuryRequest.getPlayerId());

        if (player.isEmpty()) {
            return ResponseEntity.badRequest().body("Player not found");
        }

        if (injuryRepository.existsByTypeAndStartDateAndPlayer(
                injuryRequest.getType(), LocalDate.parse(injuryRequest.getStartDate()), player.get())) {
            return ResponseEntity.badRequest().body("Injury already exists for this player");
        }

        Injury injury = new Injury();
        injury.setType(injuryRequest.getType());
        injury.setStartDate(LocalDate.parse(injuryRequest.getStartDate().toString()));
        injury.setEndDate(LocalDate.parse(injuryRequest.getEndDate().toString()));
        injury.setPlayer(player.get());

        injuryRepository.save(injury);
        return ResponseEntity.ok("Injury added successfully");
    }

    @GetMapping("/player/{playerId}")
    public List<Injury> getInjuriesByPlayerId(@PathVariable Long playerId) {
        return injuryRepository.findByPlayerId(playerId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editInjury(@PathVariable Long id, @RequestBody Injury updatedInjury) {
        Injury injury = injuryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Injury not found"));

        //Player player = playerRepository.findById(id)
        Player player = playerRepository.findById(injury.getPlayer().getId())
                .orElseThrow(() -> new RuntimeException("Player not found"));

        injury.setType(updatedInjury.getType());
        injury.setStartDate(updatedInjury.getStartDate());
        injury.setEndDate(updatedInjury.getEndDate());
        injury.setPlayer(player);
        injuryRepository.save(injury);
        return ResponseEntity.ok("Injury updated successfully");
    }


}