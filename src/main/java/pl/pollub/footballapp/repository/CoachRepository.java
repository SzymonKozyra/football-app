package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.Country;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CoachRepository extends JpaRepository<Coach, Long> {
    boolean existsByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);

    List<Coach> findByFirstNameContainingOrLastNameContaining(String query, String query1);

    boolean existsByFirstNameAndLastNameAndDateOfBirthAndCountry(String firstName, String lastName, LocalDate parse, Country country);

    //Optional<Object> findByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);
    Optional<Coach> findByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);

    //boolean existsByFirstNameAndLastNameAndCountryAndDateOfBirth(String firstName, String lastName, Country country, LocalDate dateOfBirths);
    boolean existsByFirstNameAndLastNameAndCountryAndDateOfBirthIsNull(String firstName, String lastName, Country country);

}
