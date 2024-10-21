package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.Country;

import java.util.List;

public interface CoachRepository extends JpaRepository<Coach, Long> {
    boolean existsByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);

    List<Coach> findByFirstNameContainingOrLastNameContaining(String query, String query1);
}
