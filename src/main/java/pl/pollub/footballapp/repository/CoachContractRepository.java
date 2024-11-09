package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.CoachContract;
//import pl.pollub.footballapp.model.PlayerContract;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CoachContractRepository extends JpaRepository<CoachContract, Long> {
    Optional<CoachContract> findByCoachIdAndEndDateIsNull(Long coachId);

    List<CoachContract> findByCoachId(Long coachId);
    List<CoachContract> findByTeamId(Long teamId);

    boolean existsByCoachIdAndIsActive(Long playerId, boolean isActive);

    List<CoachContract> findByIsActiveAndEndDateBefore(boolean isActive, LocalDate date);
}
