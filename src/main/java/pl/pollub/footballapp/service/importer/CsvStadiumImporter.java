package pl.pollub.footballapp.service.importer;


import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.exception.DuplicateStadiumsException;
import pl.pollub.footballapp.model.Stadium;
import pl.pollub.footballapp.repository.StadiumRepository;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.requests.StadiumRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Component
public class CsvStadiumImporter implements DataImporter {

    @Autowired
    private StadiumRepository stadiumRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Override
    public List<StadiumRequest> importData(InputStream inputStream) throws IOException {
        List<StadiumRequest> stadiumRequests = new ArrayList<>();
        List<StadiumRequest> duplicates = new ArrayList<>(); // To track duplicates

        Iterable<CSVRecord> records = CSVFormat.DEFAULT
                .withHeader("name", "cityName", "countryName", "capacity")
                .withFirstRecordAsHeader()
                .parse(new InputStreamReader(inputStream));


        for (CSVRecord record : records) {
            String stadiumName = record.get("name");
            String cityName = record.get("cityName");
            String countryName = record.get("countryName");
            int capacity = Integer.parseInt(record.get("capacity"));

            StadiumRequest stadiumRequest = new StadiumRequest();
            stadiumRequest.setName(stadiumName);
            stadiumRequest.setCityName(cityName);
            stadiumRequest.setCountryName(countryName);
            stadiumRequest.setCapacity(capacity);

            Optional<City> cityOptional = cityRepository.findByNameAndCountryName(cityName, countryName);

            if (cityOptional.isEmpty()) {
                throw new IllegalArgumentException("City not found: " + cityName + ", " + countryName);
            }

            City city = cityOptional.get();

            boolean stadiumExists = stadiumRepository.existsByNameAndCity(stadiumName, city);
            if (stadiumExists) {
                duplicates.add(stadiumRequest);
                continue;
            }

            stadiumRequests.add(stadiumRequest);
        }

        if (!duplicates.isEmpty()) {
            throw new DuplicateStadiumsException(duplicates);
        }

        return stadiumRequests;
    }

}