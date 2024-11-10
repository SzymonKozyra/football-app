package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.Referee;

import java.time.LocalDate;
import java.util.List;

public interface RefereeRepository extends JpaRepository<Referee, Long> {
    List<Referee> findByFirstNameContainingOrLastNameContaining(String firstName, String lastName);
    boolean existsByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);

    boolean existsByFirstNameAndLastNameAndDateOfBirthAndCountry(String firstName, String lastName, LocalDate parse, Country country);

    boolean existsByFirstNameAndLastNameAndCountryAndDateOfBirthIsNull(String firstName, String lastName, Country country);
}
