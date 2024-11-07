package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Country;

import java.util.Optional;

@Repository
public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByNameAndCountryName(String cityName, String countryName);

    boolean existsByNameAndCountry(String name, Country country);

    Object findByNameContaining(String query);

    Optional<City> findByNameAndCountry(String cityName, Country country);
}

