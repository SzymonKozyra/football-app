package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.Tournament;
import pl.pollub.footballapp.repository.TournamentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TournamentService {
    private final TournamentRepository tournamentRepository;

    @Autowired
    public TournamentService(TournamentRepository tournamentRepository) {
        this.tournamentRepository = tournamentRepository;
    }

    public Tournament saveTournament(Tournament tournament) {
        return tournamentRepository.save(tournament);
    }

    public List<Tournament> getAllTournaments() {
        return tournamentRepository.findAll();
    }

    public Optional<Tournament> getTournamentById(Long id) {
        return tournamentRepository.findById(id);
    }

    public void deleteTournament(Long id) {
        tournamentRepository.deleteById(id);
    }

    public List<Tournament> searchByName(String name) {
        return tournamentRepository.findByNameContainingIgnoreCase(name);
    }

    public Tournament updateTournament(Long id, Tournament updatedTournament) {
        return tournamentRepository.findById(id)
                .map(tournament -> {
                    tournament.setName(updatedTournament.getName());
                    tournament.setEdition(updatedTournament.getEdition());
                    return tournamentRepository.save(tournament);
                })
                .orElseThrow(() -> new RuntimeException("Tournament with ID " + id + " not found"));
    }
}