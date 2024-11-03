package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.PasswordResetTokenRepository;
import pl.pollub.footballapp.repository.PlayerRepository;
import pl.pollub.footballapp.repository.UserRepository;
import pl.pollub.footballapp.service.UserService;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import pl.pollub.footballapp.requests.InjuryRequest;
import pl.pollub.footballapp.repository.InjuryRepository;
import pl.pollub.footballapp.model.Injury;


import java.io.IOException;
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

    @Autowired
    private ImporterFactory importerFactory;



    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addInjury(@RequestBody Injury injuryRequest) {
        Optional<Player> player = playerRepository.findById(injuryRequest.getPlayer().getId());

        if (player.isEmpty()) {
            return ResponseEntity.badRequest().body("Player not found");
        }

        if (injuryRepository.existsByTypeAndStartDateAndPlayer(injuryRequest.getType(), injuryRequest.getStartDate(), player.get())) {
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

//    @PostMapping("/import")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<?> importInjuries(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
//        try {
//            DataImporter importer = importerFactory.getImporterInjury(fileType);
//            List<Injury> injuryRequests = importer.importData(file.getInputStream());
//
//            for (Injury injuryRequest : injuryRequests) {
//                Player player = playerRepository.findById(injuryRequest.getPlayer().getId())
//                        .orElseThrow(() -> new RuntimeException("Player not found for ID: " + injuryRequest.getPlayer().getId()));
//
//                if (!injuryRepository.existsByTypeAndStartDateAndPlayer(injuryRequest.getType(), injuryRequest.getStartDate(), player)) {
//                    Injury injury = new Injury();
//                    injury.setType(injuryRequest.getType());
//                    injury.setStartDate(LocalDate.parse(injuryRequest.getStartDate().toString()));
//                    injury.setEndDate(LocalDate.parse(injuryRequest.getEndDate().toString()));
//                    injury.setPlayer(player);
//
//                    injuryRepository.save(injury);
//                }
//            }
//
//            return ResponseEntity.ok("Injuries imported successfully");
//
//        } catch (IOException e) {
//            return ResponseEntity.status(500).body("Error importing injuries: " + e.getMessage());
//        }
//    }

    @PutMapping("/{id}")
    public ResponseEntity<?> editInjury(@PathVariable Long id, @RequestBody Injury updatedInjury) {
        Injury injury = injuryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Injury not found"));
        injury.setType(updatedInjury.getType());
        injury.setStartDate(updatedInjury.getStartDate());
        injury.setEndDate(updatedInjury.getEndDate());
        injury.setPlayer(updatedInjury.getPlayer());
        injuryRepository.save(injury);
        return ResponseEntity.ok("Injury updated successfully");
    }


}