package pl.pollub.footballapp.service.importer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.requests.CityRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CsvCityImporter implements DataImporter {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Override
    public List<CityRequest> importData(InputStream inputStream) throws IOException {
        List<CityRequest> cityRequests = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;

            while ((line = reader.readLine()) != null) {
                String[] data = line.split(",");

                if (data.length != 2) {
                    System.out.println("Invalid line format: " + line);
                    continue;
                }

                String cityName = data[0].trim();
                String countryName = data[1].trim();

                try {
                    Optional<Country> countryOpt = countryRepository.findByName(countryName);
                    if (countryOpt.isPresent()) {
                        Country country = countryOpt.get();

                        // Check if the city already exists in the database
                        Optional<City> existingCity = cityRepository.findByNameAndCountry(cityName, country);
                        if (existingCity.isPresent()) {
                            System.out.println("City already exists in the database: " + cityName + " in " + countryName);
                            continue;  // Skip adding this city if it already exists in the database
                        }

                        // Check if the city is already added in this import session (avoid file duplicates)
                        boolean isDuplicateInFile = cityRequests.stream()
                                .anyMatch(request -> request.getName().equals(cityName) && request.getCountryName().equals(countryName));

                        if (isDuplicateInFile) {
                            System.out.println("Duplicate city in file: " + cityName + " in " + countryName);
                            continue;  // Skip adding this city if it's a duplicate within the file
                        }

                        // Add to the city requests list
                        CityRequest cityRequest = new CityRequest();
                        cityRequest.setName(cityName);
                        cityRequest.setCountryName(countryName);
                        cityRequests.add(cityRequest);

                        // Save the city to the database
                        City city = new City(cityName, country);
                        cityRepository.save(city);
                    } else {
                        System.err.println("Country not found: " + countryName);
                    }
                } catch (NullPointerException e) {
                    System.out.println("Country repository is not initialized.");
                    continue;
                }
            }
        }
        return cityRequests;
    }
}
