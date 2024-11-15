package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.PlayersMatchSquad;

public interface PlayersMatchSquadRepository extends JpaRepository<PlayersMatchSquad, Long> {
}
