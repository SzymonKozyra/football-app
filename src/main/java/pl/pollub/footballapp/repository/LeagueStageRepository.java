package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.LeagueStage;

public interface LeagueStageRepository extends JpaRepository<LeagueStage, Long> {
}
