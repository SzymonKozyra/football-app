package pl.pollub.footballapp.service.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateDeserializer;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.requests.PlayerRequest;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

@Service
public class JsonPlayerImporter implements DataImporter {

    @Override
    public List<PlayerRequest> importData(InputStream inputStream) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();

        // Dodanie obsługi LocalDate z odpowiednim formatowaniem
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        javaTimeModule.addDeserializer(LocalDate.class, new LocalDateDeserializer(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
        objectMapper.registerModule(javaTimeModule);

        // Parsowanie danych z JSON do tablicy PlayerRequest
        PlayerRequest[] playerRequests = objectMapper.readValue(inputStream, PlayerRequest[].class);

        return Arrays.asList(playerRequests);
    }
}
