package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Position;

import java.util.List;

public interface PositionRepository extends JpaRepository<Position, Long> {
    List<Position> findByNameContainingIgnoreCase(String query);
}
