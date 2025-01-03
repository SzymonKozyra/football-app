package pl.pollub.footballapp.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.pollub.footballapp.model.Coach;
import pl.pollub.footballapp.model.Country;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface CoachRepository extends JpaRepository<Coach, Long> {
    boolean existsByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);

    @Query("SELECT c FROM Coach c WHERE LOWER(CONCAT(c.firstName, ' ', c.lastName)) LIKE %:query% OR LOWER(c.nickname) LIKE %:query%")
    List<Coach> findByFullNameOrNicknameContaining(@Param("query") String query, Sort sort);

    boolean existsByFirstNameAndLastNameAndDateOfBirthAndCountry(String firstName, String lastName, LocalDate parse, Country country);

    //Optional<Object> findByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);
    Optional<Coach> findByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);

    //boolean existsByFirstNameAndLastNameAndCountryAndDateOfBirth(String firstName, String lastName, Country country, LocalDate dateOfBirths);
    boolean existsByFirstNameAndLastNameAndCountryAndDateOfBirthIsNull(String firstName, String lastName, Country country);

    List<Coach> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String name, String name1);
}
