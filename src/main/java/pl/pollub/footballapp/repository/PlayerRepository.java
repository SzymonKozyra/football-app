package pl.pollub.footballapp.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Player;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    @Query("SELECT p FROM Player p WHERE LOWER(CONCAT(p.firstName, ' ', p.lastName)) LIKE %:query%")
    List<Player> findByFullNameContaining(@Param("query") String query, Sort sort);

    boolean existsByFirstNameAndLastNameAndDateOfBirthAndCountryId(String firstName, String lastName, LocalDate dateOfBirth, Long countryId);

    List<Player> findAllByTeamId(Long teamId);

    List<Player> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCase(String name, String name1);
}
