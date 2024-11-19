package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.MatchSquad;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatusIn(List<MatchStatus> statuses);

}
