package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.MatchSquad;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatusIn(List<MatchStatus> statuses);

    @Query("SELECT m FROM Match m WHERE " +
            "LOWER(m.homeTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%')) OR " +
            "LOWER(m.awayTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%'))")
    List<Match> searchByTeamName(@Param("teamName") String teamName);

    @Query("SELECT m FROM Match m WHERE " +
            "LOWER(m.homeTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%')) OR " +
            "LOWER(m.awayTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%'))")
    List<Match> findByTeamName(@Param("teamName") String teamName);

    @Query("SELECT m FROM Match m WHERE " +
            "LOWER(m.homeTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%')) OR " +
            "LOWER(m.awayTeam.name) LIKE LOWER(CONCAT('%', :teamName, '%'))")
    List<Match> findByTeamNameContaining(@Param("teamName") String teamName);

    List<Match> findAllByDateTimeBetween(LocalDateTime startOfDay, LocalDateTime endOfDay);

    List<Match> findByStatus(MatchStatus status);
}
