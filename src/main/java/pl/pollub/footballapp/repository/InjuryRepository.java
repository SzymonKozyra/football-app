package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.pollub.footballapp.model.Injury;
import pl.pollub.footballapp.model.Player;

import java.time.LocalDate;
import java.util.List;

public interface InjuryRepository extends JpaRepository<Injury, Long> {
    boolean existsByTypeAndStartDateAndPlayer(String type, LocalDate startDate, Player player);

    List<Injury> findByPlayerId(Long playerId);

    @Query("SELECT CASE WHEN COUNT(i) > 0 THEN TRUE ELSE FALSE END FROM Injury i WHERE i.player.id = :playerId AND i.type = :type AND (i.endDate IS NULL OR i.endDate >= :startDate) AND i.startDate <= COALESCE(:endDate, CURRENT_DATE)")
    boolean existsOverlappingInjury(@Param("playerId") Long playerId, @Param("type") String type, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

}
