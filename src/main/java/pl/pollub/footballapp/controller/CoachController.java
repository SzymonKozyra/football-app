package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.requests.CoachRequest;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/coaches")
public class CoachController {

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private ImporterFactory importerFactory;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    //public ResponseEntity<?> addCoach(@RequestBody CoachRequest coachRequest) {
    public ResponseEntity<?> addCoach(@RequestBody Coach coachRequest) {
        Optional<Country> country = countryRepository.findByName(coachRequest.getCountry().getName());

        if (country.isEmpty()) {
            return ResponseEntity.badRequest().body("Country not found");
        }

        if (coachRepository.existsByFirstNameAndLastNameAndCountry(coachRequest.getFirstName(), coachRequest.getLastName(), country.get())) {
            return ResponseEntity.badRequest().body("Coach already exists");
        }

        Coach coach = new Coach();
        coach.setFirstName(coachRequest.getFirstName());
        coach.setLastName(coachRequest.getLastName());
        //coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
        coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
        coach.setNickname(coachRequest.getNickname());
        coach.setCountry(country.get());

        coachRepository.save(coach);
        return ResponseEntity.ok("Coach added successfully");
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importCoaches(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            DataImporter importer = importerFactory.getImporterCoach(fileType);
            List<CoachRequest> coachRequests = importer.importData(file.getInputStream());

            for (CoachRequest coachRequest : coachRequests) {
                Country country = countryRepository.findByName(coachRequest.getCountryName())
                        //.orElseThrow(() -> new IllegalArgumentException("Country not found: " + coachRequest.getCountryName()));
                        .orElseThrow(() -> new RuntimeException("Country not found: " + coachRequest.getCountryName()));

                if (!coachRepository.existsByFirstNameAndLastNameAndCountry(coachRequest.getFirstName(), coachRequest.getLastName(), country)) {
                    Coach coach = new Coach();
                    coach.setFirstName(coachRequest.getFirstName());
                    coach.setLastName(coachRequest.getLastName());
                    coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
                    coach.setNickname(coachRequest.getNickname());
                    coach.setCountry(country);
                    coachRepository.save(coach);
                }
            }

            return ResponseEntity.ok("Coaches imported successfully");
            //return ResponseEntity.ok(coachRepository.findByNameContaining(query));

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing coaches: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<Coach>> searchCoaches(@RequestParam("query") String query) {
        List<Coach> coaches = coachRepository.findByFirstNameContainingOrLastNameContaining(query, query);
        return ResponseEntity.ok(coaches);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateCoach(@PathVariable Long id, @RequestBody CoachRequest coachRequest) {
        // Znajdź trenera
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        // Znajdź kraj na podstawie nazwy kraju (countryName)
        Country country = countryRepository.findByName(coachRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        // Aktualizacja danych trenera
        coach.setFirstName(coachRequest.getFirstName());
        coach.setLastName(coachRequest.getLastName());
        coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
        coach.setNickname(coachRequest.getNickname());
        coach.setCountry(country); // Przypisz kraj do trenera

        coachRepository.save(coach); // Zapisz trenera

        return ResponseEntity.ok("Coach updated successfully");
    }
}
