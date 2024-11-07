package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.requests.CoachRequest;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.service.CoachService;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachService coachService;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addCoach(@RequestBody Coach coachRequest) {
        return coachService.addCoach(coachRequest);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importCoaches(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            return coachService.importCoaches(file, fileType);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing coaches: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<Coach>> searchCoaches(@RequestParam("query") String query) {
        return coachService.searchCoaches(query);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateCoach(@PathVariable Long id, @RequestBody CoachRequest coachRequest) {
        return coachService.updateCoach(id, coachRequest);
    }
}
