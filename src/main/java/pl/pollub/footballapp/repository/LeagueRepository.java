package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.Country;

import java.util.List;
import java.util.Optional;

public interface LeagueRepository extends JpaRepository<League, Long> {

    boolean existsByNameAndCountry(String name, Country country);

    List<League> findByNameContaining(String query);

    Optional<Object> findByName(String leagueName);
}
