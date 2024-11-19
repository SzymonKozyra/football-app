package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.model.Player;
import pl.pollub.footballapp.repository.MatchSquadRepository;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class MatchSquadService {

    private final MatchSquadRepository matchSquadRepository;
    private static final Logger logger = LoggerFactory.getLogger(MatchSquadService.class);

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

    public List<Player> getPlayersByMatchId(Long matchId) {
        logger.debug("Fetching players for matchId: {}", matchId);
        List<Player> players = matchSquadRepository.findPlayersByMatchId(matchId);
        logger.debug("Found players: {}", players);
        return matchSquadRepository.findPlayersByMatchId(matchId);
    }

    public List<Player> getFirstSquadPlayers(Long matchId) {
        return matchSquadRepository.findFirstSquadPlayersByMatchId(matchId);
    }

    public List<Player> getSubstitutePlayers(Long matchId) {
        return matchSquadRepository.findSubstitutePlayersByMatchId(matchId);
    }
}
