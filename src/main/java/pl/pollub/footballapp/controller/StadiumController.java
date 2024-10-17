package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.exception.DuplicateStadiumsException;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.Stadium;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.StadiumRepository;
import pl.pollub.footballapp.requests.StadiumRequest;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.service.importer.ImporterFactory;
import pl.pollub.footballapp.service.importer.DataImporter;


import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/stadiums")
@CrossOrigin(origins = "http://localhost:3000")
public class StadiumController {

    @Autowired
    private StadiumRepository stadiumRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private ImporterFactory importerFactory;

    @PreAuthorize("hasRole('MODERATOR')")
    @PostMapping("/add")
    public ResponseEntity<?> addStadium(@RequestBody StadiumRequest stadiumRequest) {
        Country country = countryRepository.findByName(stadiumRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("Country not found"));

        City city = cityRepository.findByNameAndCountryName(stadiumRequest.getCityName(), stadiumRequest.getCountryName())
                .orElseThrow(() -> new RuntimeException("City not found"));

        Stadium stadium = new Stadium();
        stadium.setName(stadiumRequest.getName());
        stadium.setCapacity(stadiumRequest.getCapacity());
        stadium.setCity(city);

        stadiumRepository.save(stadium);
        return ResponseEntity.ok("Stadium added successfully");
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importStadiums(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            DataImporter importer = importerFactory.getImporter(fileType);
            List<StadiumRequest> stadiumRequests = importer.importData(file.getInputStream());

            List<StadiumRequest> duplicates = new ArrayList<>();  // For tracking duplicates

            for (StadiumRequest stadiumRequest : stadiumRequests) {
                Optional<Country> countryOptional = countryRepository.findByName(stadiumRequest.getCountryName());
                if (countryOptional.isEmpty()) {
                    throw new IllegalArgumentException("Country not found: " + stadiumRequest.getCountryName());
                }

                Country country = countryOptional.get();

                Optional<City> cityOptional = cityRepository.findByNameAndCountryName(stadiumRequest.getCityName(), stadiumRequest.getCountryName());
                if (cityOptional.isEmpty()) {
                    throw new IllegalArgumentException("City not found: " + stadiumRequest.getCityName() + " in country " + country.getName());
                }

                City city = cityOptional.get();

                boolean stadiumExists = stadiumRepository.existsByNameAndCity(stadiumRequest.getName(), city);
                if (stadiumExists) {
                    duplicates.add(stadiumRequest); // Add to the duplicates list
                    continue;  // Skip adding this stadium
                }

                Stadium stadium = new Stadium();
                stadium.setName(stadiumRequest.getName());
                stadium.setCapacity(stadiumRequest.getCapacity());
                stadium.setCity(city);  // Associate the city with the stadium

                stadiumRepository.save(stadium);  // Save the stadium to the database

                System.out.println("TEST");
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Stadiums imported with duplicates.");
            response.put("duplicates", duplicates);  // Add the list of duplicates to the response

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error importing stadiums: " + e.getMessage());
        } catch (DuplicateStadiumsException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Some stadiums were not imported due to duplicates.");
            response.put("duplicates", e.getDuplicateStadiums());  // Add the list of duplicates to the response
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
