package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.requests.LeagueRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.*;

@Service
public class LeagueService {

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private ImporterFactory importerFactory;

    public ResponseEntity<?> addLeague(LeagueRequest leagueRequest) {
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


    public ResponseEntity<?> importLeagues(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterLeague(fileType);
        List<LeagueRequest> leagueRequests = importer.importData(file.getInputStream());

        List<Integer> duplicateIndices = new ArrayList<>();  // Track indices of duplicate records

        for (int i = 0; i < leagueRequests.size(); i++) {
            LeagueRequest leagueRequest = leagueRequests.get(i);
            Optional<Country> countryOptional = countryRepository.findByName(leagueRequest.getCountryName());

            if (countryOptional.isEmpty()) {
                throw new IllegalArgumentException("Country not found: " + leagueRequest.getCountryName());
            }

            Country country = countryOptional.get();

            boolean leagueExists = leagueRepository.existsByNameAndCountry(leagueRequest.getName(), country);
            if (leagueExists) {
                duplicateIndices.add(i + 1);  // Add 1 to make indices user-friendly (1-based index)
                continue;  // Skip adding this league
            }

            League league = new League();
            league.setName(leagueRequest.getName());
            league.setCountry(country);

            leagueRepository.save(league);
        }

        String message = "Leagues imported successfully.";
        if (!duplicateIndices.isEmpty()) {
            message += " Skipped records at positions: " + duplicateIndices.toString();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", message);
        response.put("duplicates", duplicateIndices);

        return ResponseEntity.ok(response);
    }

    public ResponseEntity<List<League>> searchLeagues(String query) {
        List<League> leagues = leagueRepository.findByNameContaining(query);
        return ResponseEntity.ok(leagues);
    }

    public ResponseEntity<?> updateLeague(Long id, LeagueRequest updatedLeagueRequest) {
        League league = leagueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("League not found"));

        Country country = countryRepository.findByName(updatedLeagueRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        league.setName(updatedLeagueRequest.getName());
        league.setCountry(country);

        leagueRepository.save(league);
        return ResponseEntity.ok("League updated successfully");
    }
}
