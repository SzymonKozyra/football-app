package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.model.Event;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
}
