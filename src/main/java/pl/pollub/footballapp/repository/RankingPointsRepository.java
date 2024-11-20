package pl.pollub.footballapp.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.pollub.footballapp.model.RankingPoints;

import java.util.List;
import java.util.Optional;

@Repository
public interface RankingPointsRepository extends JpaRepository<RankingPoints, Long> {

    List<RankingPoints> findByRankingId(Long rankingId);

    List<RankingPoints> findByUserId(Long userId);

    Optional<RankingPoints> findByUserIdAndRankingId(Long userId, Long rankingId);
}
