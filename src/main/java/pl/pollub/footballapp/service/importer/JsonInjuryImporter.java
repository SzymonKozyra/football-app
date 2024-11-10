package pl.pollub.footballapp.service.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.requests.InjuryRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Service
public class JsonInjuryImporter implements DataImporter {

    @Override
    public List<InjuryRequest> importData(InputStream inputStream) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        JavaTimeModule module = new JavaTimeModule();
        module.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        objectMapper.registerModule(module);

        InjuryRequest[] injuryRequests = objectMapper.readValue(inputStream, InjuryRequest[].class);
        return Arrays.asList(injuryRequests);
    }
}
