package pl.pollub.footballapp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Ranking;
import pl.pollub.footballapp.requests.RankingRequest;
import pl.pollub.footballapp.service.RankingService;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rankings")
public class RankingController {

    private final RankingService rankingService;

    @Autowired
    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping
    public ResponseEntity<List<Ranking>> getAllRankings() {
        List<Ranking> rankings = rankingService.getAllRankings();
        return ResponseEntity.ok(rankings);
    }


    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> createRanking(@RequestBody RankingRequest rankingRequest) {
        return rankingService.createRanking(rankingRequest);
    }
}

