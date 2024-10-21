package pl.pollub.footballapp.service.importer;

import pl.pollub.footballapp.requests.CityRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

public class CsvCityImporter implements DataImporter {

    @Override
    public List<CityRequest> importData(InputStream inputStream) throws IOException {
        List<CityRequest> cityRequests = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] values = line.split(",");
                CityRequest cityRequest = new CityRequest();
                cityRequest.setName(values[0].trim());
                cityRequest.setCountryName(values[1].trim());
                cityRequests.add(cityRequest);
            }
        }
        return cityRequests;
    }
}