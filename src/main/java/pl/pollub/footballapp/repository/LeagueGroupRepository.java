package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.LeagueGroup;

import java.util.List;

public interface LeagueGroupRepository extends JpaRepository<LeagueGroup, Long> {
    List<LeagueGroup> findByLeagueId(Long leagueId);
}
