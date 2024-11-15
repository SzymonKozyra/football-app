package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.pollub.footballapp.model.FavoriteLeague;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.User;

import java.util.List;
import java.util.Optional;

public interface FavoriteLeagueRepository extends JpaRepository<FavoriteLeague, Long> {
    @Query("SELECT fl FROM FavoriteLeague fl JOIN FETCH fl.league WHERE fl.user.id = :userId")
    List<FavoriteLeague> findFavoriteLeaguesByUserId(Long userId);

    Optional<FavoriteLeague> findByUserAndLeague(User user, League league);
}
