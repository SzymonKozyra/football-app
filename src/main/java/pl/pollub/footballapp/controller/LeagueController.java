package pl.pollub.footballapp.controller;

import jakarta.annotation.security.PermitAll;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.requests.LeagueRequest;
import pl.pollub.footballapp.service.LeagueService;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/leagues")
@CrossOrigin(origins = "http://localhost:3000")
public class LeagueController {
    private LeagueService leagueService;
    @Autowired
    private LeagueRepository leagueRepository;

    private static final Logger logger = LoggerFactory.getLogger(LeagueController.class);

    @Autowired
    public LeagueController(LeagueService leagueService) {
        this.leagueService = leagueService;
    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addLeague(@RequestBody LeagueRequest leagueRequest) {
        return leagueService.addLeague(leagueRequest);
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importLeagues(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            return leagueService.importLeagues(file, fileType);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing leagues: " + e.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<League>> searchLeagues(@RequestParam("query") String query) {
        return leagueService.searchLeagues(query);
    }
//    @GetMapping("/search")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<List<League>> searchLeagues(@RequestParam(required = false) String query) {
//        List<League> leagues;
//        if (query == null || query.isEmpty()) {
//            leagues = leagueService.getAllLeagues();  // Zwraca wszystkie ligi, jeśli query jest puste
//        } else {
//            leagues = (List<League>) leagueService.searchLeagues(query);
//            //leagues = leagueService.searchLeagues(query);
//        }
//        return ResponseEntity.ok(leagues);
//    }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> updateLeague(@PathVariable Long id, @RequestBody LeagueRequest updatedLeagueRequest) {
        return leagueService.updateLeague(id, updatedLeagueRequest);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> deleteLeague(@PathVariable Long id) {
        return leagueService.deleteLeague(id);
    }

    @GetMapping
    @PermitAll
    public ResponseEntity<List<League>> getAllLeagues() {
        return ResponseEntity.ok(leagueService.getAllLeagues());
    }


    @GetMapping("/countries")
    @PermitAll
    public ResponseEntity<List<String>> getDistinctCountries() {
        logger.info("Received request to get distinct countries");
        List<Country> distinctCountries = leagueRepository.findDistinctCountries();
        logger.debug("Distinct countries fetched: {}", distinctCountries);
        List<String> countryNames = distinctCountries.stream()
                .map(Country::getName)
                .collect(Collectors.toList());
        logger.debug("Country names mapped: {}", countryNames);
        return ResponseEntity.ok(countryNames);
    }

    @GetMapping("/byCountry")
    @PermitAll
    public ResponseEntity<List<League>> getLeaguesByCountry(@RequestParam String country) {
        logger.info("Received request to get leagues for country: {}", country);
        List<League> leagues = leagueRepository.findByCountryName(country);
        logger.debug("Leagues fetched for country {}: {}", country, leagues);
        return ResponseEntity.ok(leagues);
    }

    @GetMapping("/editions")
    @PermitAll
    public ResponseEntity<List<String>> getEditions(
            @RequestParam String leagueName,
            @RequestParam String country) {
        logger.info("Received request to get editions for league: {}, country: {}", leagueName, country);
        List<String> editions = leagueRepository.findEditionsByNameAndCountry(leagueName, country);
        logger.debug("Editions fetched for league {} in country {}: {}", leagueName, country, editions);
        return ResponseEntity.ok(editions);
    }


    @GetMapping("/getByDetails")
    @PermitAll
    public ResponseEntity<League> getLeagueByDetails(
            @RequestParam String country,
            @RequestParam String name,
            @RequestParam String edition) {
        League league = leagueRepository.findByCountryNameAndNameAndEdition(country, name, edition)
                .orElseThrow(() -> new RuntimeException("League not found"));
        return ResponseEntity.ok(league);
    }

    @GetMapping("/{id}")
    @PermitAll
    public ResponseEntity<League> getLeagueById(@PathVariable Long id) {
        return leagueService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


}
