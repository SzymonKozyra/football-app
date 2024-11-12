package pl.pollub.footballapp.repository;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.Country;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LeagueRepository extends JpaRepository<League, Long> {
    Optional<League> findByNameAndCountry(String name, Country country);
    boolean existsByNameAndCountry(String name, Country country);

    @Query("SELECT l FROM League l WHERE LOWER(l.name) LIKE %:query%")
    List<League> findByNameContaining(@Param("query") String query, Sort sort);

    Optional<Object> findByName(String leagueName);
}
