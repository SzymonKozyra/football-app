package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.pollub.footballapp.model.FavoriteLeague;

import java.util.List;

public interface FavoriteLeagueRepository extends JpaRepository<FavoriteLeague, Long> {
    @Query("SELECT fl FROM FavoriteLeague fl JOIN FETCH fl.league WHERE fl.user.id = :userId")
    List<FavoriteLeague> findFavoriteLeaguesByUserId(Long userId);
}
