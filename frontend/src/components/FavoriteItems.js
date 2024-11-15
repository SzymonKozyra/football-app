import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
            // Fetch the user email from the backend
            axios.get(`${BASE_URL}/api/auth/get-email`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    const userEmail = response.data;

                    // Fetch the user ID based on the email
                    return axios.get(`${BASE_URL}/api/auth/users/email/${userEmail}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                })
                .then(response => setUserId(response.data.id))
                .catch(error => console.error('Error fetching user ID:', error));
        }
    }, [token]);

    useEffect(() => {
        // Fetch all teams, leagues, and matches with the JWT token
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
            // Fetch favorite items by user ID to get complete details
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
                .then(() => {
                    // Refetch favorite items after adding a new favorite
                    axios.get(`${BASE_URL}/api/favorites/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                        .then(response => setFavorites(response.data))
                        .catch(error => console.error('Error fetching updated favorites:', error));
                })
                .catch(error => console.error(`Error adding ${type} to favorites:`, error));
        } else {
            console.error("User ID not found");
        }
    };

    return (
        <div>
            <h2>All Teams</h2>
            <ul>
                {teams.map(team => (
                    <li key={team.id}>
                        {team.name}
                        <button onClick={() => addFavorite('team', team)}>Add to Favorites</button>
                    </li>
                ))}
            </ul>

            <h2>All Leagues</h2>
            <ul>
                {leagues.map(league => (
                    <li key={league.id}>
                        {league.name}
                        <button onClick={() => addFavorite('league', league)}>Add to Favorites</button>
                    </li>
                ))}
            </ul>

            <h2>All Matches</h2>
            <ul>
                {matches.map(match => (
                    <li key={match.id}>
                        Match ID: {match.id}
                        <button onClick={() => addFavorite('match', match)}>Add to Favorites</button>
                    </li>
                ))}
            </ul>

            <h2>Favorites</h2>
            <div>
                <h3>Teams</h3>
                <ul>{favorites.teams.map(fav => <li key={fav.team.id}>{fav.team.name}</li>)}</ul>
                <h3>Leagues</h3>
                <ul>{favorites.leagues.map(fav => <li key={fav.league.id}>{fav.league.name}</li>)}</ul>
                <h3>Matches</h3>
                <ul>{favorites.matches.map(fav => <li key={fav.match.id}>Match ID: {fav.match.id}</li>)}</ul>
            </div>
        </div>
    );
};

export default FavoriteItems;
