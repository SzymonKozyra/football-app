package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.PlayersMatchSquad;
import pl.pollub.footballapp.repository.PlayersMatchSquadRepository;

import java.util.List;
import java.util.Optional;

@Service
public class PlayersMatchSquadService {

    private final PlayersMatchSquadRepository playersMatchSquadRepository;

    @Autowired
    public PlayersMatchSquadService(PlayersMatchSquadRepository playersMatchSquadRepository) {
        this.playersMatchSquadRepository = playersMatchSquadRepository;
    }

    public PlayersMatchSquad addPlayerToSquad(PlayersMatchSquad player) {
        return playersMatchSquadRepository.save(player);
    }

    public Optional<PlayersMatchSquad> getPlayerById(Long id) {
        return playersMatchSquadRepository.findById(id);
    }

    public List<PlayersMatchSquad> getAllPlayers() {
        return playersMatchSquadRepository.findAll();
    }

    public void deletePlayerById(Long id) {
        playersMatchSquadRepository.deleteById(id);
    }
}
