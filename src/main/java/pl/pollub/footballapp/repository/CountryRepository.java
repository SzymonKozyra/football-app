package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.Country;

import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, Long> {
    boolean existsByName(String name);

    Optional<Country> findByName(String countryName);
}
