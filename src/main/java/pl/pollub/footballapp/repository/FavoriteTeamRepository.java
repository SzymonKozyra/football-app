package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.pollub.footballapp.model.FavoriteTeam;

import java.util.List;

public interface FavoriteTeamRepository extends JpaRepository<FavoriteTeam, Long> {
    @Query("SELECT fl FROM FavoriteTeam fl JOIN FETCH fl.team WHERE fl.user.id = :userId")
    List<FavoriteTeam> findFavoriteTeamsByUserId(Long userId);}
