package pl.pollub.footballapp.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.pollub.footballapp.model.LeagueGroup;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.League;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    boolean existsByNameAndLeague(String name, League league);

    @Query("SELECT t FROM Team t WHERE LOWER(t.name) LIKE %:query%")
    List<Team> findByNameContaining(@Param("query") String query, Sort sort);

    List<Team> findByGroup(LeagueGroup group);
}
