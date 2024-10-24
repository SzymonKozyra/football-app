package pl.pollub.footballapp.service.importer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.requests.TeamRequest;
import pl.pollub.footballapp.repository.CoachRepository;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.repository.TeamRepository;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Service
public class JsonTeamImporter implements DataImporter {

    @Autowired
    private CoachRepository coachRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Autowired
    private TeamRepository teamRepository;

    @Override
    public List<TeamRequest> importData(InputStream inputStream) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        TeamRequest[] teamRequests = objectMapper.readValue(inputStream, TeamRequest[].class);

        return Arrays.asList(teamRequests);
    }
}
