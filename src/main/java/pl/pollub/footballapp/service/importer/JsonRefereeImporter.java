package pl.pollub.footballapp.service.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.requests.RefereeRequest;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Service
public class JsonRefereeImporter implements DataImporter {

    @Override
    public List<RefereeRequest> importData(InputStream inputStream) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        return Arrays.asList(objectMapper.readValue(inputStream, RefereeRequest[].class));
    }
}
