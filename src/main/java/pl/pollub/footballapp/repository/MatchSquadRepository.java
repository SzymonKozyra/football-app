package pl.pollub.footballapp.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.pollub.footballapp.model.MatchSquad;
import pl.pollub.footballapp.model.Player;

import java.util.List;

public interface MatchSquadRepository extends JpaRepository<MatchSquad, Long> {
    @Query("SELECT ms.player FROM MatchSquad ms WHERE ms.match.id = :matchId")
    List<Player> findPlayersByMatchId(Long matchId);

    // Find players who are part of the first squad for a given match
    @Query("SELECT ms.player FROM MatchSquad ms WHERE ms.match.id = :matchId AND ms.firstSquad = true")
    List<Player> findFirstSquadPlayersByMatchId(@Param("matchId") Long matchId);

    // Find players who are not part of the first squad for a given match
    @Query("SELECT ms.player FROM MatchSquad ms WHERE ms.match.id = :matchId AND ms.firstSquad = false")
    List<Player> findSubstitutePlayersByMatchId(@Param("matchId") Long matchId);

    List<MatchSquad> findByMatchId(Long matchId);
}

