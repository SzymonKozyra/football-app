package pl.pollub.footballapp.service.importer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.requests.CoachRequest;
import pl.pollub.footballapp.service.importer.DataImporter;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
public class CsvCoachImporter implements DataImporter {

    @Override
    public List<CoachRequest> importData(InputStream inputStream) throws IOException {
        List<CoachRequest> coachRequests = new ArrayList<>();
        CSVParser parser = new CSVParser(new InputStreamReader(inputStream), CSVFormat.DEFAULT.withHeader());

        for (CSVRecord record : parser) {
            CoachRequest coachRequest = new CoachRequest();
            coachRequest.setFirstName(record.get("first_name"));
            coachRequest.setLastName(record.get("last_name"));
            coachRequest.setDateOfBirth(record.get("date_of_birth"));
            coachRequest.setNickname(record.get("nickname"));
            coachRequest.setCountryName(record.get("country_name"));

            coachRequests.add(coachRequest);
        }

        return coachRequests;
    }
}
