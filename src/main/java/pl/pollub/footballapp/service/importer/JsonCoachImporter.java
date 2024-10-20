package pl.pollub.footballapp.service.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.requests.CoachRequest;
import pl.pollub.footballapp.service.importer.DataImporter;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Component
public class JsonCoachImporter implements DataImporter {

    @Override
    public List<CoachRequest> importData(InputStream inputStream) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        CoachRequest[] coachRequests = objectMapper.readValue(inputStream, CoachRequest[].class);
        return Arrays.asList(coachRequests);
    }
}
