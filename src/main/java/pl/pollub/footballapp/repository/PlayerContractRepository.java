package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.model.PlayerContract;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PlayerContractRepository extends JpaRepository<PlayerContract, Long> {
    List<PlayerContract> findByPlayerId(Long playerId);
    List<PlayerContract> findByTeamId(Long teamId);
    List<PlayerContract> findByIsActive(boolean isActive);
    boolean existsByPlayerIdAndIsActive(Long playerId, boolean isActive);

    List<PlayerContract> findByIsActiveAndEndDateBefore(boolean isActive, LocalDate date);
}
