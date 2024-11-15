package pl.pollub.footballapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.pollub.footballapp.model.FavoriteTeam;
import pl.pollub.footballapp.model.FavoriteLeague;
import pl.pollub.footballapp.model.FavoriteMatch;
import pl.pollub.footballapp.repository.FavoriteTeamRepository;
import pl.pollub.footballapp.repository.FavoriteLeagueRepository;
import pl.pollub.footballapp.repository.FavoriteMatchRepository;

import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteTeamRepository favoriteTeamRepository;

    @Autowired
    private FavoriteLeagueRepository favoriteLeagueRepository;

    @Autowired
    private FavoriteMatchRepository favoriteMatchRepository;

    public List<FavoriteTeam> getFavoriteTeamsByUserId(Long userId) {
        return favoriteTeamRepository.findFavoriteTeamsByUserId(userId);
    }

    public List<FavoriteLeague> getFavoriteLeaguesByUserId(Long userId) {
        return favoriteLeagueRepository.findFavoriteLeaguesByUserId(userId);
    }

    public List<FavoriteMatch> getFavoriteMatchesByUserId(Long userId) {
        return favoriteMatchRepository.findFavoriteMatchesByUserId(userId);
    }
}
