package pl.pollub.footballapp.service.importer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
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

        // Create a CSVParser with headers from the first line
        CSVParser parser = new CSVParser(new InputStreamReader(inputStream), CSVFormat.DEFAULT.withHeader());

        for (CSVRecord record : parser) {
            CityRequest cityRequest = new CityRequest();
            cityRequest.setName(record.get("name"));
            cityRequest.setCountryName(record.get("countryName"));

            cityRequests.add(cityRequest);
        }

        parser.close();  // Close the parser after use
        return cityRequests;
    }

}
