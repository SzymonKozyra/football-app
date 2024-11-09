package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Injury;
import pl.pollub.footballapp.model.Player;

import java.time.LocalDate;
import java.util.List;

public interface InjuryRepository extends JpaRepository<Injury, Long> {
    boolean existsByTypeAndStartDateAndPlayer(String type, LocalDate startDate, Player player);

    List<Injury> findByPlayerId(Long playerId);
}
