package pl.pollub.footballapp.service.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import pl.pollub.footballapp.requests.CityRequest;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

public class JsonCityImporter implements DataImporter{

    @Override
    public List<CityRequest> importData(InputStream inputStream) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        CityRequest[] cityRequestsArray = objectMapper.readValue(inputStream, CityRequest[].class);
        return Arrays.asList(cityRequestsArray);
    }
}