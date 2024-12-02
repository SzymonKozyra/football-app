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

    boolean existsByNameAndCountry(String name, Country country);

    @Query("SELECT l FROM League l WHERE LOWER(l.name) LIKE %:query%")
    List<League> findByNameContaining(@Param("query") String query, Sort sort);

    Optional<Object> findByName(String leagueName);

    boolean existsByNameAndCountryAndEdition(String name, Country country, String edition);

    @Query("SELECT DISTINCT l.country FROM League l")
    List<Country> findDistinctCountries();

    @Query("SELECT l FROM League l WHERE l.country.name = :countryName")
    List<League> findByCountryName(@Param("countryName") String countryName);

    @Query("SELECT DISTINCT l.edition FROM League l WHERE l.name = :leagueName AND l.country.name = :countryName")
    List<String> findEditionsByNameAndCountry(@Param("leagueName") String leagueName, @Param("countryName") String countryName);

    Optional<League> findByCountryNameAndNameAndEdition(String country, String name, String edition);
}
