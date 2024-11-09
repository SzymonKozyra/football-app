package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.CoachContract;
//import pl.pollub.footballapp.model.PlayerContract;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.repository.CoachContractRepository;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.requests.CoachContractRequest;

import java.util.List;

@RestController
@RequestMapping("/api/coach-contracts")
public class CoachContractController {

    @Autowired
    private CoachContractRepository coachContractRepository;

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private TeamRepository teamRepository;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addCoachContract(@RequestBody CoachContractRequest request) {
//        coachContractRepository.findByCoachIdAndEndDateIsNull(request.getCoachId()).ifPresent(contract -> {
//            throw new IllegalArgumentException("Coach already has an active contract.");
//        });
//        if (coachContractRepository.findByCoachIdAndEndDateIsNull(request.getCoachId()).isPresent()) {
//            return ResponseEntity.badRequest().body("Coach already has an active contract.");
//        }
        boolean hasActiveContract = coachContractRepository.existsByCoachIdAndIsActive(request.getCoachId(), true);

        if (hasActiveContract) {
            return ResponseEntity.badRequest().body("Coach already has an active contract.");
        }


        // Pobieranie obiektu Coach na podstawie ID
        Coach coach = coachRepository.findById(request.getCoachId())
                .orElseThrow(() -> new IllegalArgumentException("Coach not found with id: " + request.getCoachId()));

        // Pobieranie obiektu Team na podstawie ID
        Team team = teamRepository.findById(request.getTeamId())
                .orElseThrow(() -> new IllegalArgumentException("Team not found with id: " + request.getTeamId()));

        CoachContract coachContract = new CoachContract();
        coachContract.setStartDate(request.getStartDate());
        coachContract.setEndDate(request.getEndDate());
        coachContract.setCoach(coach);
        coachContract.setTeam(team);
        coachContract.setSalary(request.getSalary());
        coachContract.setTransferFee(request.getTransferFee());
        coachContractRepository.save(coachContract);
        return ResponseEntity.ok("Coach contract added successfully");
    }

    @GetMapping("/coach/{coachId}")
    @PreAuthorize("hasRole('MODERATOR')")
    public List<CoachContract> getContractsByCoach(@PathVariable Long coachId) {
        return coachContractRepository.findByCoachId(coachId);
    }

    @GetMapping("/team/{teamId}")
    @PreAuthorize("hasRole('MODERATOR')")
    public List<CoachContract> getContractsByTeam(@PathVariable Long teamId) {
        return coachContractRepository.findByTeamId(teamId);
    }


    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<CoachContract>> searchCoachContracts(@RequestParam Long coachId) {
        // Contracts by coach ID
        List<CoachContract> contracts = coachContractRepository.findByCoachId(coachId);
        return ResponseEntity.ok(contracts);
    }

//    @PutMapping("/{id}")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<CoachContract> editCoachContract(@PathVariable Long id, @RequestBody CoachContractRequest request) {
//        CoachContract coachContract = coachContractRepository.findById(id)
//                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));
//        coachContract.setStartDate(request.getStartDate());
//        coachContract.setEndDate(request.getEndDate());
//        coachContract.setSalary(request.getSalary());
//        coachContract.setTransferFee(request.getTransferFee());
//        coachContractRepository.save(coachContract);
//        return ResponseEntity.ok(coachContract);
//    }


    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<CoachContract> getCoachContractById(@PathVariable Long id) {
        CoachContract coachContract = coachContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));
        return ResponseEntity.ok(coachContract);
    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    //public ResponseEntity<?> editCoachContract(@PathVariable Long id, @RequestBody CoachContractRequest request) {
    public ResponseEntity<CoachContract> editCoachContract(@PathVariable Long id, @RequestBody CoachContractRequest request) {

        if (id == null) {
            throw new IllegalArgumentException("Contract ID must not be null");
        }


        CoachContract coachContract = coachContractRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Contract not found"));

        Coach coach = coachRepository.findById(coachContract.getCoach().getId())
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        Team team = teamRepository.findById(coachContract.getTeam().getId())
                .orElseThrow(() -> new RuntimeException("Team not found"));


        coachContract.setCoach(coach);
        coachContract.setTeam(team);
        coachContract.setStartDate(request.getStartDate());
        coachContract.setEndDate(request.getEndDate());
        coachContract.setSalary(request.getSalary());
        coachContract.setTransferFee(request.getTransferFee());

//        coachContractRepository.save(coachContract);
//        return ResponseEntity.ok("Coach contract updated successfully");
        CoachContract updatedContract = coachContractRepository.save(coachContract);
        return ResponseEntity.ok(updatedContract);
    }
}