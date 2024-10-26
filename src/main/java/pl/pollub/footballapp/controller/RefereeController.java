package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.requests.RefereeRequest;
import pl.pollub.footballapp.model.Referee;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.RefereeRepository;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/referees")
public class RefereeController {

    @Autowired
    private RefereeRepository refereeRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private ImporterFactory importerFactory;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addReferee(@RequestBody RefereeRequest refereeRequest) {
        Country country = countryRepository.findByName(refereeRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        if (refereeRepository.existsByFirstNameAndLastNameAndCountry(refereeRequest.getFirstName(), refereeRequest.getLastName(), country)) {
            return ResponseEntity.badRequest().body("Referee already exists");
        }

        Referee referee = new Referee();
        referee.setFirstName(refereeRequest.getFirstName());
        referee.setLastName(refereeRequest.getLastName());
        referee.setDateOfBirth(LocalDate.parse(refereeRequest.getDateOfBirth()));
        referee.setCountry(country);

        refereeRepository.save(referee);
        return ResponseEntity.ok("Referee added successfully");
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importReferees(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            DataImporter importer = importerFactory.getImporterReferee(fileType);
            List<RefereeRequest> refereeRequests = importer.importData(file.getInputStream());

            for (RefereeRequest refereeRequest : refereeRequests) {
                Country country = countryRepository.findByName(refereeRequest.getCountryName())
                        .orElseThrow(() -> new RuntimeException("Country not found"));

                if (!refereeRepository.existsByFirstNameAndLastNameAndCountry(refereeRequest.getFirstName(), refereeRequest.getLastName(), country)) {
                    Referee referee = new Referee();
                    referee.setFirstName(refereeRequest.getFirstName());
                    referee.setLastName(refereeRequest.getLastName());
                    referee.setDateOfBirth(LocalDate.parse(refereeRequest.getDateOfBirth()));
                    referee.setCountry(country);

                    refereeRepository.save(referee);
                }
            }

            return ResponseEntity.ok("Referees imported successfully");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing referees: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<List<Referee>> searchReferees(@RequestParam("query") String query) {
        List<Referee> referees = refereeRepository.findByFirstNameContainingOrLastNameContaining(query, query);
        return ResponseEntity.ok(referees);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateReferee(@PathVariable Long id, @RequestBody RefereeRequest updatedRequest) {
        Referee referee = refereeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Referee not found"));

        Country country = countryRepository.findByName(updatedRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        referee.setFirstName(updatedRequest.getFirstName());
        referee.setLastName(updatedRequest.getLastName());
        referee.setDateOfBirth(LocalDate.parse(updatedRequest.getDateOfBirth()));
        referee.setCountry(country);

        refereeRepository.save(referee);
        return ResponseEntity.ok("Referee updated successfully");
    }
}
