package pl.pollub.footballapp.service.importer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.requests.LeagueRequest;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Component
public class CsvLeagueImporter implements DataImporter {

    @Override
    public List<LeagueRequest> importData(InputStream inputStream) throws IOException {
        List<LeagueRequest> leagueRequests = new ArrayList<>();

        Iterable<CSVRecord> records = CSVFormat.DEFAULT
                .withHeader("name", "countryName", "edition")
                .withFirstRecordAsHeader()
                .parse(new InputStreamReader(inputStream));

        for (CSVRecord record : records) {
            LeagueRequest leagueRequest = new LeagueRequest(
                    record.get("name"),
                    record.get("countryName"),
                    record.get("edition")
            );
            leagueRequests.add(leagueRequest);
        }

        return leagueRequests;
    }
}
