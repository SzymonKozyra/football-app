import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const BASE_URL = 'http://localhost:8080';

const FavoriteItems = () => {
    const [teams, setTeams] = useState([]);
    const [leagues, setLeagues] = useState([]);
    const [matches, setMatches] = useState([]);
    const [favorites, setFavorites] = useState({ teams: [], leagues: [], matches: [] });
    const [userId, setUserId] = useState(null);

    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        if (token) {
            axios.get(`${BASE_URL}/api/auth/get-email`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const userEmail = response.data;
                    return axios.get(`${BASE_URL}/api/auth/users/email/${userEmail}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                })
                .then(response => setUserId(response.data.id))
                .catch(error => console.error('Error fetching user ID:', error));
        }
    }, [token]);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/teams`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setTeams(response.data))
            .catch(error => console.error('Error fetching teams:', error));

        axios.get(`${BASE_URL}/api/leagues`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setLeagues(response.data))
            .catch(error => console.error('Error fetching leagues:', error));

        axios.get(`${BASE_URL}/api/matches`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setMatches(response.data))
            .catch(error => console.error('Error fetching matches:', error));
    }, [token]);

    useEffect(() => {
        if (userId) {
            axios.get(`${BASE_URL}/api/favorites/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setFavorites(response.data))
                .catch(error => console.error('Error fetching favorites:', error));
        }
    }, [userId, token]);

    const addFavorite = (type, item) => {
        const endpointMap = {
            team: `${BASE_URL}/api/favorite-teams/add`,
            league: `${BASE_URL}/api/favorite-leagues/add`,
            match: `${BASE_URL}/api/favorite-matches/add`
        };

        if (userId) {
            const dataMap = {
                team: { teamId: item.id, userId: userId },
                league: { leagueId: item.id, userId: userId },
                match: { matchId: item.id, userId: userId }
            };

            axios.post(endpointMap[type], dataMap[type], {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => refetchFavorites())
                .catch(error => console.error(`Error adding ${type} to favorites:`, error));
        }
    };

    const removeFavorite = (type, item) => {
        const endpointMap = {
            team: `${BASE_URL}/api/favorite-teams/remove`,
            league: `${BASE_URL}/api/favorite-leagues/remove`,
            match: `${BASE_URL}/api/favorite-matches/remove`
        };

        if (userId) {
            const dataMap = {
                team: { teamId: item.id, userId: userId },
                league: { leagueId: item.id, userId: userId },
                match: { matchId: item.id, userId: userId }
            };

            axios.delete(endpointMap[type], {
                data: dataMap[type],
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(() => refetchFavorites())
                .catch(error => console.error(`Error removing ${type} from favorites:`, error));
        }
    };

    const refetchFavorites = () => {
        axios.get(`${BASE_URL}/api/favorites/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setFavorites(response.data))
            .catch(error => console.error('Error fetching updated favorites:', error));
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">All Items</h2>
            <div className="row">
                <div className="col-md-4">
                    <h3>Teams</h3>
                    <ul className="list-group">
                        {teams.map(team => (
                            <li key={team.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {team.name}
                                <button className="btn btn-sm btn-primary" onClick={() => addFavorite('team', team)}>
                                    Add to Favorites
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-4">
                    <h3>Leagues</h3>
                    <ul className="list-group">
                        {leagues.map(league => (
                            <li key={league.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {league.name}
                                <button className="btn btn-sm btn-primary" onClick={() => addFavorite('league', league)}>
                                    Add to Favorites
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-4">
                    <h3>Matches</h3>
                    <ul className="list-group">
                        {matches.map(match => (
                            <li key={match.id} className="list-group-item d-flex justify-content-between align-items-center">
                                Match ID: {match.id}
                                <button className="btn btn-sm btn-primary" onClick={() => addFavorite('match', match)}>
                                    Add to Favorites
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <h2 className="text-center my-4">Favorites</h2>
            <div className="row">
                <div className="col-md-4">
                    <h3>Favorite Teams</h3>
                    <ul className="list-group">
                        {favorites.teams.map(fav => (
                            <li key={fav.team.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {fav.team.name}
                                <button className="btn btn-sm btn-danger" onClick={() => removeFavorite('team', fav.team)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-4">
                    <h3>Favorite Leagues</h3>
                    <ul className="list-group">
                        {favorites.leagues.map(fav => (
                            <li key={fav.league.id} className="list-group-item d-flex justify-content-between align-items-center">
                                {fav.league.name}
                                <button className="btn btn-sm btn-danger" onClick={() => removeFavorite('league', fav.league)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-md-4">
                    <h3>Favorite Matches</h3>
                    <ul className="list-group">
                        {favorites.matches.map(fav => (
                            <li key={fav.match.id} className="list-group-item d-flex justify-content-between align-items-center">
                                Match ID: {fav.match.id}
                                <button className="btn btn-sm btn-danger" onClick={() => removeFavorite('match', fav.match)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FavoriteItems;
