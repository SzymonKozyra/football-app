package pl.pollub.footballapp.service.importer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.requests.PlayerRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvPlayerImporter implements DataImporter {

    private Long parseLong(String value) {
        try {
            return value != null && !value.isEmpty() ? Long.parseLong(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Double parseDouble(String value) {
        try {
            return value != null && !value.isEmpty() ? Double.parseDouble(value) : null;
        } catch (NumberFormatException e) {
            return null;
        }
    }

    @Override
    public List<PlayerRequest> importData(InputStream inputStream) throws IOException {
        BufferedReader fileReader = new BufferedReader(new InputStreamReader(inputStream));
        CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());

        List<PlayerRequest> playerRequests = new ArrayList<>();
        Iterable<CSVRecord> csvRecords = csvParser.getRecords();

        for (CSVRecord csvRecord : csvRecords) {
            Double parsedValue = parseDouble(csvRecord.get("value"));
            BigDecimal value = parsedValue != null ? BigDecimal.valueOf(parsedValue) : BigDecimal.ZERO;

            PlayerRequest playerRequest = new PlayerRequest(
                    csvRecord.get("firstName"),
                    csvRecord.get("lastName"),
                    LocalDate.parse(csvRecord.get("dateOfBirth")),
                    csvRecord.get("nickname"),
                    csvRecord.get("picture"),
                    parseLong(csvRecord.get("positionId")),
                    parseLong(csvRecord.get("countryId")),
                    value
            );
            playerRequests.add(playerRequest);
        }

        return playerRequests;
    }
}
