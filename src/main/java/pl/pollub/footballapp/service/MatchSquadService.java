package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.repository.MatchSquadRepository;

import java.util.List;
import java.util.Optional;

@Service
public class MatchSquadService {

    private final MatchSquadRepository matchSquadRepository;

    @Autowired
    public MatchSquadService(MatchSquadRepository matchSquadRepository) {
        this.matchSquadRepository = matchSquadRepository;
    }

    public MatchSquad addMatchSquad(MatchSquad matchSquad) {
        return matchSquadRepository.save(matchSquad);
    }

    public List<MatchSquad> getAllMatchSquads() {
        return matchSquadRepository.findAll();
    }

    public Optional<MatchSquad> getMatchSquadById(Long id) {
        return matchSquadRepository.findById(id);
    }

    public void deleteMatchSquad(Long id) {
        matchSquadRepository.deleteById(id);
    }
}
