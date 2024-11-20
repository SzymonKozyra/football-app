package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.RankingPoints;
import pl.pollub.footballapp.service.RankingPointsService;

import java.util.List;

@RestController
@RequestMapping("/api/ranking-points")
public class RankingPointsController {

    private final RankingPointsService rankingPointsService;

    @Autowired
    public RankingPointsController(RankingPointsService rankingPointsService) {
        this.rankingPointsService = rankingPointsService;
    }

    @GetMapping("/{rankingId}")
    public ResponseEntity<List<RankingPoints>> getRankingPointsByRankingId(@PathVariable Long rankingId) {
        List<RankingPoints> points = rankingPointsService.getRankingPointsByRankingId(rankingId);
        return ResponseEntity.ok(points);
    }

//    @PutMapping("/update")
//    public ResponseEntity<RankingPoints> updateRankingPoints(
//            @RequestParam Long userId,
//            @RequestParam Long rankingId,
//            @RequestParam int additionalPoints) {
//        RankingPoints updatedPoints = rankingPointsService.updateRankingPoints(userId, rankingId, additionalPoints);
//        return ResponseEntity.ok(updatedPoints);
//    }
}
