package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.pollub.footballapp.model.FavoriteMatch;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.User;

import java.util.List;
import java.util.Optional;

public interface FavoriteMatchRepository extends JpaRepository<FavoriteMatch, Long> {
    @Query("SELECT fl FROM FavoriteMatch fl JOIN FETCH fl.match WHERE fl.user.id = :userId")
    List<FavoriteMatch> findFavoriteMatchesByUserId(Long userId);

    Optional<FavoriteMatch> findByUserAndMatch(User user, Match match);
}
