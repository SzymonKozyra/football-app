package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.requests.LeagueRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/leagues")
@CrossOrigin(origins = "http://localhost:3000")
public class LeagueController {

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private ImporterFactory importerFactory;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addLeague(@RequestBody LeagueRequest leagueRequest) {
        Country country = countryRepository.findByName(leagueRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        boolean leagueExists = leagueRepository.existsByNameAndCountry(leagueRequest.getName(), country);
        if (leagueExists) {
            return ResponseEntity.badRequest().body("League already exists");
        }

        League league = new League();
        league.setName(leagueRequest.getName());
        league.setCountry(country);

        leagueRepository.save(league);
        return ResponseEntity.ok("League added successfully");
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importLeagues(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            DataImporter importer = importerFactory.getImporterLeague(fileType);
            List<LeagueRequest> leagueRequests = importer.importData(file.getInputStream());

            List<LeagueRequest> duplicates = new ArrayList<>();  // For tracking duplicates

            for (LeagueRequest leagueRequest : leagueRequests) {
                Optional<Country> countryOptional = countryRepository.findByName(leagueRequest.getCountryName());
                if (countryOptional.isEmpty()) {
                    throw new IllegalArgumentException("Country not found: " + leagueRequest.getCountryName());
                }

                Country country = countryOptional.get();

                boolean leagueExists = leagueRepository.existsByNameAndCountry(leagueRequest.getName(), country);
                if (leagueExists) {
                    duplicates.add(leagueRequest); // Add to the duplicates list
                    continue;  // Skip adding this league
                }

                League league = new League();
                league.setName(leagueRequest.getName());
                league.setCountry(country);

                leagueRepository.save(league);
            }

            Map<String, Object> response = Map.of("message", "Leagues imported with duplicates.", "duplicates", duplicates);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing leagues: " + e.getMessage());
        }
    }
}
