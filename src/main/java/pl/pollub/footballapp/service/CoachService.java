package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.requests.CoachRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class CoachService {

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private ImporterFactory importerFactory;

    public ResponseEntity<?> addCoach(Coach coachRequest) {
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
        coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
        coach.setNickname(coachRequest.getNickname());
        coach.setCountry(country.get());

        coachRepository.save(coach);
        return ResponseEntity.ok("Coach added successfully");
    }

    public ResponseEntity<?> importCoaches(MultipartFile file, String fileType) throws IOException {
        DataImporter importer = importerFactory.getImporterCoach(fileType);
        List<CoachRequest> coachRequests = importer.importData(file.getInputStream());

        for (CoachRequest coachRequest : coachRequests) {
            Country country = countryRepository.findByName(coachRequest.getCountryName())
                    .orElseThrow(() -> new RuntimeException("Country not found: " + coachRequest.getCountryName()));

//            if (!coachRepository.existsByFirstNameAndLastNameAndCountry(coachRequest.getFirstName(), coachRequest.getLastName(), country)) {
                Coach coach = new Coach();
                coach.setFirstName(coachRequest.getFirstName());
                coach.setLastName(coachRequest.getLastName());
                coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
                coach.setNickname(coachRequest.getNickname());
                coach.setCountry(country);
                coachRepository.save(coach);
//            }
        }

        return ResponseEntity.ok("Coaches imported successfully");
    }

    public ResponseEntity<List<Coach>> searchCoaches(String query) {
        List<Coach> coaches = coachRepository.findByFirstNameContainingOrLastNameContaining(query, query);
        return ResponseEntity.ok(coaches);
    }

    public ResponseEntity<?> updateCoach(Long id, CoachRequest coachRequest) {
        Coach coach = coachRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coach not found"));

        Country country = countryRepository.findByName(coachRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        coach.setFirstName(coachRequest.getFirstName());
        coach.setLastName(coachRequest.getLastName());
        coach.setDateOfBirth(LocalDate.parse(coachRequest.getDateOfBirth()));
        coach.setNickname(coachRequest.getNickname());
        coach.setCountry(country);

        coachRepository.save(coach);

        return ResponseEntity.ok("Coach updated successfully");
    }
}
