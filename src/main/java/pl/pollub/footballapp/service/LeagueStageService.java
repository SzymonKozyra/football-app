package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.LeagueStage;
import pl.pollub.footballapp.repository.LeagueStageRepository;

import java.util.List;
import java.util.Optional;

@Service
public class LeagueStageService {

    @Autowired
    private LeagueStageRepository leagueStageRepository;

    public LeagueStage saveLeagueStage(LeagueStage leagueStage) {
        return leagueStageRepository.save(leagueStage);
    }

    public List<LeagueStage> getAllStages() {
        return leagueStageRepository.findAll();
    }

    public Optional<LeagueStage> getStageById(Long id) {
        return leagueStageRepository.findById(id);
    }

    public void deleteStage(Long id) {
        leagueStageRepository.deleteById(id);
    }
}
