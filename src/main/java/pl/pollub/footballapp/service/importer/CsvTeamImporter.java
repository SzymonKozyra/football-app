package pl.pollub.footballapp.service.importer;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.repository.TeamRepository;
import pl.pollub.footballapp.requests.TeamRequest;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

@Service
public class CsvTeamImporter implements DataImporter {

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Override
    public List<TeamRequest> importData(InputStream inputStream) throws IOException {
        BufferedReader fileReader = new BufferedReader(new InputStreamReader(inputStream));
        CSVParser csvParser = new CSVParser(fileReader, CSVFormat.DEFAULT.withFirstRecordAsHeader().withIgnoreHeaderCase().withTrim());

        List<TeamRequest> teamRequests = new ArrayList<>();
        Iterable<CSVRecord> csvRecords = csvParser.getRecords();

        for (CSVRecord csvRecord : csvRecords) {
            TeamRequest teamRequest = new TeamRequest(
                    csvRecord.get("name"),
                    csvRecord.get("picture"),
                    Boolean.parseBoolean(csvRecord.get("isClub")),
                    Long.parseLong(csvRecord.get("coachId")), // Pobieranie ID trenera
                    Long.parseLong(csvRecord.get("leagueId")) // Pobieranie ID ligi
            );
            teamRequests.add(teamRequest);
        }

        return teamRequests;
    }
}
