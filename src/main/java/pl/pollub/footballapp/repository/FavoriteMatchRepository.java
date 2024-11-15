package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.pollub.footballapp.model.FavoriteMatch;

import java.util.List;

public interface FavoriteMatchRepository extends JpaRepository<FavoriteMatch, Long> {
    @Query("SELECT fl FROM FavoriteMatch fl JOIN FETCH fl.match WHERE fl.user.id = :userId")
    List<FavoriteMatch> findFavoriteMatchesByUserId(Long userId);
}
