package pl.pollub.footballapp.service.importer;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.model.Stadium;
import pl.pollub.footballapp.repository.StadiumRepository;
import pl.pollub.footballapp.repository.CityRepository;
import pl.pollub.footballapp.repository.CountryRepository;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.requests.StadiumRequest;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Component
public class JsonStadiumImporter implements DataImporter {

    @Autowired
    private StadiumRepository stadiumRepository;

    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private CountryRepository countryRepository;

    @Override
    public List<StadiumRequest> importData(InputStream inputStream) throws IOException {
        System.out.println("******* * * * * ** * * * * * * *  Importing data...");

        ObjectMapper objectMapper = new ObjectMapper();
        StadiumRequest[] stadiumRequests = objectMapper.readValue(inputStream, StadiumRequest[].class);


        return Arrays.asList(stadiumRequests);
    }

}