package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.pollub.footballapp.model.FavoriteTeam;
import pl.pollub.footballapp.model.Team;
import pl.pollub.footballapp.model.User;

import java.util.List;
import java.util.Optional;

public interface FavoriteTeamRepository extends JpaRepository<FavoriteTeam, Long> {
    @Query("SELECT fl FROM FavoriteTeam fl JOIN FETCH fl.team WHERE fl.user.id = :userId")
    List<FavoriteTeam> findFavoriteTeamsByUserId(Long userId);

    Optional<FavoriteTeam> findByUserAndTeam(User user, Team team);
}
