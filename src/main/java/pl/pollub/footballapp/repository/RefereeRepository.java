package pl.pollub.footballapp.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pl.pollub.footballapp.model.Country;
import pl.pollub.footballapp.model.Referee;

import java.time.LocalDate;
import java.util.List;

public interface RefereeRepository extends JpaRepository<Referee, Long> {

    @Query("SELECT r FROM Referee r WHERE LOWER(CONCAT(r.firstName, ' ', r.lastName)) LIKE %:query%")
    List<Referee> findByFullNameContaining(@Param("query") String query, Sort sort);

    boolean existsByFirstNameAndLastNameAndCountry(String firstName, String lastName, Country country);

    boolean existsByFirstNameAndLastNameAndDateOfBirthAndCountry(String firstName, String lastName, LocalDate parse, Country country);

    boolean existsByFirstNameAndLastNameAndCountryAndDateOfBirthIsNull(String firstName, String lastName, Country country);
}
