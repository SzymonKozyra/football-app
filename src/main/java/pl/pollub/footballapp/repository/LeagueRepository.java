package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.Country;

import java.util.Optional;

public interface LeagueRepository extends JpaRepository<League, Long> {
    Optional<League> findByNameAndCountry(String name, Country country);
    boolean existsByNameAndCountry(String name, Country country);
}
