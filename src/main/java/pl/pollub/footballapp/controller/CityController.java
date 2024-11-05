package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.requests.CityRequest;
import pl.pollub.footballapp.service.importer.DataImporter;
import pl.pollub.footballapp.service.importer.ImporterFactory;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cities")
public class CityController {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Autowired
    private ImporterFactory importerFactory;

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addCity(@RequestBody City cityRequest) {
        Optional<Country> country = countryRepository.findByName(cityRequest.getCountry().getName());

        if (country.isEmpty()) {
            return ResponseEntity.badRequest().body("Country not found");
        }

        if (cityRepository.existsByNameAndCountry(cityRequest.getName(), country.get())) {
            return ResponseEntity.badRequest().body("City already exists in this country");
        }

        City city = new City();
        city.setName(cityRequest.getName());
        city.setCountry(country.get());

        cityRepository.save(city);
        return ResponseEntity.ok("City added successfully");
    }

    @GetMapping("/search")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> searchCities(@RequestParam("query") String query) {
        return ResponseEntity.ok(cityRepository.findByNameContaining(query));
    }

    @PostMapping("/import")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> importCities(@RequestParam("file") MultipartFile file, @RequestParam("type") String fileType) {
        try {
            DataImporter importer = importerFactory.getImporterCity(fileType);
            List<CityRequest> cityRequests = importer.importData(file.getInputStream());

            for (CityRequest cityRequest : cityRequests) {
                Country country = countryRepository.findByName(cityRequest.getCountryName())
                        .orElseThrow(() -> new IllegalArgumentException("Country not found: " + cityRequest.getCountryName()));

                if (!cityRepository.existsByNameAndCountry(cityRequest.getName(), country)) {
                    City city = new City();
                    city.setName(cityRequest.getName());
                    city.setCountry(country);
                    cityRepository.save(city);
                }
                System.out.println("KURWAAAAAAAAAAAAAAAAAA                KURWA");
            }

            return ResponseEntity.ok("Cities imported successfully");

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error importing cities: " + e.getMessage());
        }
    }

}
