package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.Referee;
import java.util.List;

public interface RefereeRepository extends JpaRepository<Referee, Long> {
    List<Referee> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
    boolean existsByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);
}
