package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import pl.pollub.footballapp.MatchStatus;
import pl.pollub.footballapp.model.*;
import pl.pollub.footballapp.repository.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class RankingPointsUpdater {

    private final MatchRepository matchRepository;
    private final BetRepository betRepository;
    private final RankingRepository rankingRepository;
    private final RankingPointsRepository rankingPointsRepository;
    private final UserRepository userRepository;

    @Autowired
    public RankingPointsUpdater(MatchRepository matchRepository, BetRepository betRepository,
                                RankingRepository rankingRepository, RankingPointsRepository rankingPointsRepository,
                                UserRepository userRepository) {
        this.matchRepository = matchRepository;
        this.betRepository = betRepository;
        this.rankingRepository = rankingRepository;
        this.rankingPointsRepository = rankingPointsRepository;
        this.userRepository = userRepository;
    }

    // Every hour
    @Scheduled(cron = "0 5 0 * * ?")
    public void updateRankings() {
        System.out.println("Starting ranking update task...");

        Ranking activeRanking = rankingRepository.findByIsActiveTrue()
                .orElseThrow(() -> new IllegalStateException("No active ranking found"));

        resetRankingPoints(activeRanking);

        List<Match> finishedMatches = matchRepository.findByStatus(MatchStatus.FINISHED);

//        for (Match match : finishedMatches) {
//            processBetsForMatch(match, activeRanking);
//        }
        List<Match> matchesWithinRanking = finishedMatches.stream()
                .filter(match -> isMatchWithinRanking(match, activeRanking))
                .collect(Collectors.toList());

        for (Match match : matchesWithinRanking) {
            processBetsForMatch(match, activeRanking);
        }

        System.out.println("Ranking update task completed.");
    }

    private void resetRankingPoints(Ranking activeRanking) {
        List<RankingPoints> rankingPointsList = rankingPointsRepository.findByRankingId(activeRanking.getId());

        for (RankingPoints rankingPoints : rankingPointsList) {
            rankingPoints.setPoints(0);
            rankingPoints.setLastUpdated(LocalDateTime.now());
        }

        rankingPointsRepository.saveAll(rankingPointsList);
        System.out.println("Points reset for active ranking.");
    }

    private void processBetsForMatch(Match match, Ranking activeRanking) {
        List<Bet> bets = betRepository.findByMatchId(match.getId());

        for (Bet bet : bets) {
            boolean isCorrect = bet.getHomeScore() == match.getHomeGoals() && bet.getAwayScore() == match.getAwayGoals();

            // Search user ranking points
            RankingPoints rankingPoints = rankingPointsRepository.findByUserIdAndRankingId(bet.getUser().getId(), activeRanking.getId())
                    .orElseGet(() -> createNewRankingPoints(bet.getUser(), activeRanking));

            // Update points
            if (isCorrect) {
                rankingPoints.setPoints(rankingPoints.getPoints() + 1);
            }

            rankingPoints.setLastUpdated(LocalDateTime.now());
            rankingPointsRepository.save(rankingPoints);

            // Update bet status
            bet.setIsCorrect(isCorrect);
            betRepository.save(bet);
        }
    }

    private RankingPoints createNewRankingPoints(User user, Ranking activeRanking) {
        RankingPoints rankingPoints = new RankingPoints();
        rankingPoints.setUser(user);
        rankingPoints.setRanking(activeRanking);
        rankingPoints.setPoints(0);
        rankingPoints.setLastUpdated(LocalDateTime.now());
        return rankingPoints;
    }

    private boolean isMatchWithinRanking(Match match, Ranking ranking) {
        LocalDate matchDate = match.getDateTime().toLocalDate();
        return (matchDate.isEqual(ranking.getStartDate()) || matchDate.isAfter(ranking.getStartDate())) &&
                (matchDate.isEqual(ranking.getEndDate()) || matchDate.isBefore(ranking.getEndDate()));
    }
}

