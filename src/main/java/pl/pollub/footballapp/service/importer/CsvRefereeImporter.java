package pl.pollub.footballapp.service.importer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.requests.RefereeRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvRefereeImporter implements DataImporter {

    @Override
    public List<RefereeRequest> importData(InputStream inputStream) throws IOException {
        BufferedReader fileReader = new BufferedReader(new InputStreamReader(inputStream));
        CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());

        List<RefereeRequest> refereeRequests = new ArrayList<>();
        for (CSVRecord record : csvParser) {
            RefereeRequest request = new RefereeRequest(
                    record.get("firstName"),
                    record.get("lastName"),
                    record.get("dateOfBirth"),
                    record.get("countryName")
            );
            refereeRequests.add(request);
        }
        return refereeRequests;
    }
}
