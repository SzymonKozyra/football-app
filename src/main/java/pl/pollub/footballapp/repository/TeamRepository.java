package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.League;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    boolean existsByNameAndLeague(String name, League league);

    List<Team> findByNameContaining(String query);
}
