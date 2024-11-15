package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pollub.footballapp.model.FavoriteMatch;
import pl.pollub.footballapp.model.Match;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.FavoriteMatchRepository;
import pl.pollub.footballapp.repository.MatchRepository;
import pl.pollub.footballapp.repository.UserRepository;

@Service
public class FavoriteMatchService {

    @Autowired
    private FavoriteMatchRepository favoriteMatchRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MatchRepository matchRepository;

    @Transactional
    public FavoriteMatch addFavoriteMatch(FavoriteMatch favoriteMatch, Long userId, Long matchId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Match match = matchRepository.findById(matchId).orElseThrow(() -> new RuntimeException("Match not found"));

        favoriteMatch.setUser(user);
        favoriteMatch.setMatch(match);

        return favoriteMatchRepository.save(favoriteMatch);
    }
}
