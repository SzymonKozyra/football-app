package pl.pollub.footballapp.controller;

import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import pl.pollub.footballapp.model.Bet;
import pl.pollub.footballapp.model.FavoriteMatch;
import pl.pollub.footballapp.repository.BetRepository;
import pl.pollub.footballapp.requests.BetRequest;
import pl.pollub.footballapp.requests.RefereeRequest;
import pl.pollub.footballapp.service.BetService;
import pl.pollub.footballapp.service.MatchService;
import pl.pollub.footballapp.service.UserService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bets")
public class BetController {

    private BetService betService;
    private BetRepository betRepository;

    @Autowired
    public BetController(BetService betService) {
        this.betService = betService;
    }

//    private BetService betService;
//    private UserService userService;
//    private MatchService matchService;
//    public BetController(BetService betService, UserService userService, MatchService matchService) {
//        this.betService = betService;
//        this.userService = userService;
//        this.matchService = matchService;
//    }

//    @PostMapping("/add/{matchId}")
//    public ResponseEntity<Bet> addBet(
//            @PathVariable Long matchId,
//            @RequestParam int homeScore,
//            @RequestParam int awayScore,
//            Authentication authentication
//    ) {
////        return ResponseEntity.ok(betService.addBet(matchId, homeScore, awayScore, authentication));
//        Bet createdBet = betService.addBet(matchId, homeScore, awayScore, authentication);
//        return ResponseEntity.ok(createdBet);
//    }


//    @GetMapping
//    public ResponseEntity<List<Bet>> getAllBets() {
//        return ResponseEntity.ok(betService.getAllBets());
//    }

    @GetMapping("/{id}")
    public ResponseEntity<Bet> getBetById(@PathVariable Long id) {
        return ResponseEntity.ok(betService.getBetById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBet(@PathVariable Long id) {
        betService.deleteBet(id);
        return ResponseEntity.noContent().build();
    }


//    @PostMapping("/place")
//    public ResponseEntity<Bet> placeBet(@RequestParam Long userId,
//                                        @RequestParam Long matchId,
//                                        @RequestParam int homeScore,
//                                        @RequestParam int awayScore) {
////        Bet bet = betService.placeBet(userId, matchId, homeScore, awayScore);
////        return ResponseEntity.ok(bet);
//        try {
//            Bet bet = betService.placeBet(
//                    betRequest.getUserId(),
//                    betRequest.getMatchId(),
//                    betRequest.getHomeScore(),
//                    betRequest.getAwayScore()
//            );
//            return ResponseEntity.ok(bet);
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(null);
//        }
//    }

//    PRAWIE DZIALA
//    @PostMapping("/place")
//    public ResponseEntity<?> placeBet(@RequestBody BetRequest betRequest) {
//        return betService.placeBet(betRequest);
//    }
//    PRAWIE DZIALA
//    @PostMapping("/place")
//    public ResponseEntity<?> placeBet(@RequestBody BetRequest betRequest, Authentication authentication) {
//        try {
//            String username = authentication.getName(); // Pobranie nazwy użytkownika z JWT
//            betService.placeBet(username, betRequest.getMatchId(), betRequest.getHomeScore(), betRequest.getAwayScore());
//            return ResponseEntity.ok("Bet placed successfully");
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.badRequest().body(e.getMessage());
//        }
//    }



//    @PostMapping("/add")
//    @PreAuthorize("hasRole('MODERATOR')")
//    public ResponseEntity<?> addBet(@RequestBody Map<String, Long> payload) {
//        Long userId = payload.get("userId");
//        Long matchId = payload.get("matchId");
//
//        Bet bet = new Bet();
//        betService.addBet(bet, userId, matchId);
//        return ResponseEntity.ok("Bet added successfully");
//    }

    @PostMapping("/add")
    @PreAuthorize("hasRole('MODERATOR')")
    public ResponseEntity<?> addBet(@RequestBody BetRequest request) {
        return betService.addBet(request);
    }





    //@PostMapping("/check/{matchId}")
    @PostMapping("/check")
    public ResponseEntity<String> checkBetResults(@RequestParam Long matchId) {
        betService.checkBetResults(matchId);
        return ResponseEntity.ok("Bet results checked successfully.");
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Bet>> getUserBets(@PathVariable Long userId) {
        List<Bet> bets = betService.getUserBets(userId);
        return ResponseEntity.ok(bets);
    }




//////////////////////
    @PostMapping("/verify/{matchId}")
    public ResponseEntity<?> verifyBetsForMatch(@PathVariable Long matchId, @RequestParam int actualHomeScore, @RequestParam int actualAwayScore) {
        betService.checkBetsForMatch(matchId, actualHomeScore, actualAwayScore);
        return ResponseEntity.ok("Bets verified successfully");
    }

    @GetMapping("/points/{userId}")
    public ResponseEntity<Integer> getUserPoints(@PathVariable Long userId) {
        return ResponseEntity.ok(betService.getUserPoints(userId));
    }
}
