package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.model.Match;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
}
