package pl.pollub.footballapp.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Player;

import java.time.LocalDate;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByFirstNameContainingOrLastNameContaining(String query, String query1, Sort sort);

    boolean existsByFirstNameAndLastNameAndDateOfBirthAndCountryId(String firstName, String lastName, LocalDate dateOfBirth, Long countryId);
}
