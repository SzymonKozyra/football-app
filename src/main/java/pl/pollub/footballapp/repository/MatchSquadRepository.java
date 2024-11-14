package pl.pollub.footballapp.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.MatchSquad;

public interface MatchSquadRepository extends JpaRepository<MatchSquad, Long> {
}

