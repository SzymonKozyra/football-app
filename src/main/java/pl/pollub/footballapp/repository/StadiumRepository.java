package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.pollub.footballapp.model.City;
import pl.pollub.footballapp.model.Stadium;

import java.util.Optional;

public interface StadiumRepository extends JpaRepository<Stadium, Long> {
    Optional<Stadium> findByNameAndCity_Id(String name, Long cityId);
    boolean existsByNameAndCity(String name, City city);

}
