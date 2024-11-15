package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.pollub.footballapp.model.FavoriteLeague;
import pl.pollub.footballapp.model.League;
import pl.pollub.footballapp.model.User;
import pl.pollub.footballapp.repository.FavoriteLeagueRepository;
import pl.pollub.footballapp.repository.LeagueRepository;
import pl.pollub.footballapp.repository.UserRepository;

import java.util.Optional;

@Service
public class FavoriteLeagueService {

    @Autowired
    private FavoriteLeagueRepository favoriteLeagueRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LeagueRepository leagueRepository;

    @Transactional
    public FavoriteLeague addFavoriteLeague(Long userId, Long leagueId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        League league = leagueRepository.findById(leagueId).orElseThrow(() -> new RuntimeException("League not found"));

        // Sprawdzenie, czy ulubiona liga już istnieje
        Optional<FavoriteLeague> existingFavorite = favoriteLeagueRepository.findByUserAndLeague(user, league);
        if (existingFavorite.isPresent()) {
            throw new RuntimeException("League is already in favorites");
        }

        FavoriteLeague favoriteLeague = new FavoriteLeague();
        favoriteLeague.setUser(user);
        favoriteLeague.setLeague(league);

        return favoriteLeagueRepository.save(favoriteLeague);
    }

    public void removeFavoriteLeague(Long userId, Long leagueId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        League league = leagueRepository.findById(leagueId).orElseThrow(() -> new RuntimeException("League not found"));

        FavoriteLeague favoriteLeague = favoriteLeagueRepository.findByUserAndLeague(user, league)
                .orElseThrow(() -> new RuntimeException("Favorite league not found"));

        favoriteLeagueRepository.delete(favoriteLeague);
    }
}
