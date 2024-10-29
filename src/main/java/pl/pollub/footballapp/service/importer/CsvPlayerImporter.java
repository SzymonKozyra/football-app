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
            return null;  // W przypadku błędu konwersji zwracamy null
        }
    }

    private Double parseDouble(String value) {
        try {
            return value != null && !value.isEmpty() ? Double.parseDouble(value) : null;
        } catch (NumberFormatException e) {
            return null;  // W przypadku błędu konwersji zwracamy null
        }
    }


    @Override
    public List<PlayerRequest> importData(InputStream inputStream) throws IOException {
        BufferedReader fileReader = new BufferedReader(new InputStreamReader(inputStream));
        CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());

        List<PlayerRequest> playerRequests = new ArrayList<>();
        Iterable<CSVRecord> csvRecords = csvParser.getRecords();

        for (CSVRecord csvRecord : csvRecords) {
            PlayerRequest playerRequest = new PlayerRequest(
                    csvRecord.get("firstName"),
                    csvRecord.get("lastName"),
                    LocalDate.parse(csvRecord.get("dateOfBirth")),  // Konwersja do LocalDate
                    csvRecord.get("nickname"),
                    csvRecord.get("picture"),
                    parseLong(csvRecord.get("positionId")),  // Konwersja do Long
                    parseLong(csvRecord.get("countryId")),   // Konwersja do Long
                    parseLong(csvRecord.get("clubId")),      // Konwersja do Long
                    parseLong(csvRecord.get("nationalTeamId")), // Konwersja do Long
                    BigDecimal.valueOf(parseDouble(csvRecord.get("value")))      // Konwersja do Double (dla wartości)
            );
            playerRequests.add(playerRequest);
        }


        return playerRequests;
    }
}
