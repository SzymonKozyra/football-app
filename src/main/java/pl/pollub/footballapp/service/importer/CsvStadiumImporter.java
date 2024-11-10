package pl.pollub.footballapp.service.importer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Stadium;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.repository.StadiumRepository;
import pl.pollub.footballapp.requests.StadiumRequest;

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
        List<StadiumRequest> duplicates = new ArrayList<>();  // Track duplicates

        Iterable<CSVRecord> records = CSVFormat.DEFAULT
                .withHeader("name", "cityName", "countryName", "capacity")
                .withFirstRecordAsHeader()
                .parse(new InputStreamReader(inputStream));

        for (CSVRecord record : records) {
            String stadiumName = record.get("name").trim();
            String cityName = record.get("cityName").trim();
            String countryName = record.get("countryName").trim();
            int capacity;

            try {
                capacity = Integer.parseInt(record.get("capacity").trim());
                if (capacity <= 0) {
                    System.out.println("Invalid capacity for stadium: " + stadiumName + " - skipping record.");
                    continue;
                }
            } catch (NumberFormatException e) {
                System.out.println("Invalid capacity format for stadium: " + stadiumName + " - skipping record.");
                continue;
            }

            StadiumRequest stadiumRequest = new StadiumRequest();
            stadiumRequest.setName(stadiumName);
            stadiumRequest.setCityName(cityName);
            stadiumRequest.setCountryName(countryName);
            stadiumRequest.setCapacity(capacity);

            // Check if the country and city exist
            Optional<City> cityOptional = cityRepository.findByNameAndCountryName(cityName, countryName);
            if (cityOptional.isEmpty()) {
                System.out.println("City or country not found for: " + cityName + ", " + countryName + " - skipping record.");
                continue;
            }

//            City city = cityOptional.get();
//
            // Check if the stadium already exists
//            boolean stadiumExists = stadiumRepository.existsByNameAndCity(stadiumName, city);
//            if (stadiumExists) {
//                duplicates.add(stadiumRequest);  // Add to duplicates if stadium already exists
//                continue;
//            }

            // Add to list of stadiums to be imported
            stadiumRequests.add(stadiumRequest);
        }

        // Add duplicates information to the main list so that the service layer can return it to the controller
        stadiumRequests.addAll(duplicates);
        return stadiumRequests;
    }
}
