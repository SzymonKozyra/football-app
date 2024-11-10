package pl.pollub.footballapp.service.importer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.requests.RefereeRequest;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvRefereeImporter implements DataImporter {

    @Override
    public List<RefereeRequest> importData(InputStream inputStream) throws IOException {
        List<RefereeRequest> refereeRequests = new ArrayList<>();
        CSVParser parser = new CSVParser(new InputStreamReader(inputStream), CSVFormat.DEFAULT.withHeader());

        for (CSVRecord record : parser) {
            RefereeRequest refereeRequest = new RefereeRequest();
            refereeRequest.setFirstName(record.get("firstName"));
            refereeRequest.setLastName(record.get("lastName"));
            String dateOfBirth = record.get("dateOfBirth").trim();
            refereeRequest.setDateOfBirth(dateOfBirth.isEmpty() ? null : dateOfBirth);
            refereeRequest.setCountryName(record.get("countryName"));

            refereeRequests.add(refereeRequest);
        }

        return refereeRequests;
    }
}
