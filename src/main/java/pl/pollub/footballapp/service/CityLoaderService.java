package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;

import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

@Service
public class CityLoaderService {

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CountryRepository countryRepository;

    @PostConstruct
    public void loadCitiesFromCsv() {
        if (cityRepository.count() == 0) {
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                    getClass().getResourceAsStream("/data/cities.csv"), StandardCharsets.UTF_8))) {

                String line;
                while ((line = reader.readLine()) != null) {
                    String[] data = line.split(";");

                    if (data.length < 2) {
                        System.out.println("Invalid line format: " + line);
                        continue;
                    }

                    String cityName = data[0];
                    String countryName = data[1];

                    Optional<Country> countryOpt = countryRepository.findByName(countryName);
                    if (countryOpt.isPresent()) {
                        City city = new City(cityName, countryOpt.get());
                        cityRepository.save(city);
                    } else {
                        System.err.println("Country not found: " + countryName);
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
