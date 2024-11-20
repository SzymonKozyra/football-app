import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TeamImageSmall from "./TeamImageSmall";
import TeamImageVerySmall from "./TeamImageVerySmall";

const BASE_URL = 'http://localhost:8080';

const MainView = () => {
    const [favorites, setFavorites] = useState({ leagues: [], teams: [] });
    const [matches, setMatches] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [userId, setUserId] = useState(null);
    const [isFavoritesReady, setIsFavoritesReady] = useState(false); // Flaga określająca gotowość
    const token = localStorage.getItem('jwtToken');

    // Pobranie ID użytkownika
    useEffect(() => {
        if (token) {
            axios.get(`${BASE_URL}/api/auth/get-email`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => {
                    const userEmail = response.data;
                    return axios.get(`${BASE_URL}/api/auth/users/email/${userEmail}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                })
                .then(response => setUserId(response.data.id))
                .catch(error => console.error('Error fetching user ID:', error));
        }
    }, [token]);

    // Pobranie ulubionych lig i drużyn
    useEffect(() => {
        if (userId) {
            axios.get(`${BASE_URL}/api/favorites/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => {
                    console.log(`Favorites fetched for ${userId}:`, response.data);
                    setFavorites(response.data); // Ustawienie favorites
                    setIsFavoritesReady(true); // Oznaczenie, że dane są gotowe
                })
                .catch(error => {
                    console.error('Error fetching favorites:', error);
                    setIsFavoritesReady(true); // Nawet w przypadku błędu ustaw flagę
                });
        }
    }, [userId, token]);

    // Pobranie meczów dla wybranej daty
    useEffect(() => {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        axios.get(`${BASE_URL}/api/matches/date/${formattedDate}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setMatches(response.data))
            .catch(error => console.error('Error fetching matches:', error));
    }, [selectedDate, token]);


    useEffect(() => {
        console.log("Stan favorites został zaktualizowany:", favorites);
    }, [favorites]);


    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };
    const updateFavorites = (newFavorites) => {
        setFavorites(newFavorites);
        console.log("Nowe wartości favorites:", newFavorites);
    };
    const goToPreviousDay = () => {
        const previousDay = new Date(selectedDate);
        previousDay.setDate(previousDay.getDate() - 1);
        setSelectedDate(previousDay);
    };

    const goToNextDay = () => {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        setSelectedDate(nextDay);
    };

    const toggleFavorite = async (type, item) => {
        console.log("Toggling favorite:", type, item);

        if (!userId || !item || !item.id) {
            console.error("Invalid userId or item.");
            return;
        }

        // Mapa typów dla liczby pojedynczej
        const typeMap = {
            teams: 'team',
            leagues: 'league',
            matches: 'match'
        };

        const singularType = typeMap[type]; // Pobranie liczby pojedynczej z mapy

        if (!singularType) {
            console.error("Invalid type provided:", type);
            return;
        }

        // Wykorzystaj includes zamiast sprawdzania w stanie favorites
        const isFavorite = type === 'matches'
            ? favorites.matches.some(fav => fav.match.id === item.id)
            : false;

        const endpointMap = {
            team: isFavorite ? `${BASE_URL}/api/favorite-teams/remove` : `${BASE_URL}/api/favorite-teams/add`,
            league: isFavorite ? `${BASE_URL}/api/favorite-leagues/remove` : `${BASE_URL}/api/favorite-leagues/add`,
            match: isFavorite ? `${BASE_URL}/api/favorite-matches/remove` : `${BASE_URL}/api/favorite-matches/add`
        };

        const dataMap = {
            team: { teamId: item.id, userId },
            league: { leagueId: item.id, userId },
            match: { matchId: item.id, userId }
        };

        const endpoint = endpointMap[singularType];
        const data = dataMap[singularType];

        if (!endpoint || !data) {
            console.error("Invalid endpoint or data for type:", singularType);
            return;
        }

        console.log("Endpoint:", endpoint);
        console.log("Data:", data);

        try {
            if (isFavorite) {
                // Usunięcie z ulubionych
                await axios({
                    method: 'delete',
                    url: endpoint,
                    headers: { Authorization: `Bearer ${token}` },
                    data: data // Przekazanie danych dla DELETE
                });
            } else {
                // Dodanie do ulubionych
                await axios.post(endpoint, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            // Odświeżanie ulubionych po każdej operacji
            await refetchFavorites();
        } catch (error) {
            console.error(`Error toggling favorite ${type}:`, error);
        }
    };

    const refetchFavorites = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/favorites/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFavorites(response.data); // Zaktualizowanie ulubionych
            console.log("Favorites refreshed:", response.data);
        } catch (error) {
            console.error("Error fetching updated favorites:", error);
        }
    };


    // const isFavorite = (type, id) => {
    //     return favorites[type].some(fav => fav[`${type.slice(0, -1)}`].id === id);
    // };



    const renderMatchesByLeague = () => {
        const favoriteMatchIds = favorites.matches.map(match => match.match.id); // Pobranie ID ulubionych meczów
        const groupedMatches = matches.reduce((acc, match) => {
            const leagueName = match.league.name;
            if (!acc[leagueName]) acc[leagueName] = [];
            acc[leagueName].push(match);
            return acc;
        }, {});

        const sortedLeagues = Object.keys(groupedMatches).sort((a, b) => a.localeCompare(b));

        return sortedLeagues.map(leagueName => (
            <Card className="mb-4" key={leagueName}>
                <Card.Header className="d-flex align-items-center">
                    {/* Flaga kraju */}
                    <img
                        src={`/assets/flags/${groupedMatches[leagueName][0].league.country.code}.svg`}
                        alt={groupedMatches[leagueName][0].league.country.name}
                        style={{ width: '20px', height: '15px', marginRight: '10px' }}
                    />
                    {leagueName}
                </Card.Header>
                <ListGroup variant="flush">
                    {groupedMatches[leagueName].map(match => (
                        <ListGroup.Item key={match.id} className="d-flex align-items-center justify-content-between">
                            {/* Gwiazdka ulubionych */}
                            <i
                                className={`bi ${favoriteMatchIds.includes(match.id) ? 'bi-star-fill text-warning' : 'bi-star'}`}
                                style={{ cursor: 'pointer' }}
                                onClick={() => toggleFavorite('matches', match)}
                            ></i>
                            {/* Godzina meczu */}
                            <span style={{ marginRight: '15px' }}>{match.time}</span>
                            {/* Drużyny */}
                            <div style={{ flex: 1 }}>
                                <div className="d-flex align-items-center">
                                    <TeamImageVerySmall team={match.homeTeam} />
                                    <span style={{ marginLeft: '10px' }}>{match.homeTeam.name}</span>
                                </div>
                                <div className="d-flex align-items-center">
                                    <TeamImageVerySmall team={match.awayTeam} />
                                    <span style={{ marginLeft: '10px' }}>{match.awayTeam.name}</span>
                                </div>
                            </div>
                            {/* Wynik meczu */}
                            {match.status === 'IN_PLAY' || match.status === 'FINISHED' ? (
                                <div style={{ textAlign: 'right' }}>
                                    <div>{match.homeGoals}</div>
                                    <div>{match.awayGoals}</div>
                                </div>
                            ) : null}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        ));
    };

    // Wstrzymaj renderowanie, jeśli ulubione dane nie są gotowe
    if (!isFavoritesReady) {
        return (
            <Container fluid>
                <Row>
                    <Col className="text-center mt-5">
                        <p>Ładowanie danych...</p>
                    </Col>
                </Row>
            </Container>
        );
    }

    return (
        <Container fluid>
            <Row>
                <Col xs={3} className="bg-light border-right">
                    <h5 className="mt-4">Ulubione rozgrywki</h5>
                    <ListGroup>
                        {favorites.leagues.map((league, index) => (
                            <ListGroup.Item key={index} className="d-flex align-items-center">
                                {/* Flaga kraju */}
                                <img
                                    src={`/assets/flags/${league.league.country.code}.svg`}
                                    alt={league.league.country.name}
                                    style={{
                                        width: '20px',
                                        height: '15px',
                                        marginRight: '10px',
                                        borderRadius: '2px',
                                        boxShadow: '0 0 2px rgba(0, 0, 0, 0.2)',
                                    }}
                                />
                                {league.league.name ? league.league.name : 'Brak nazwy'}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    <h5 className="mt-4">Ulubione drużyny</h5>
                    <ListGroup>
                        {favorites.teams.map(team => (
                            <ListGroup.Item key={team.id} className="d-flex align-items-center">
                                {/* Herb drużyny */}
                                <TeamImageVerySmall team={team.team} />
                                <span style={{ marginLeft: '10px' }}>{team.team.name}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                <Col xs={9}>
                    <div className="d-flex align-items-center justify-content-between mt-4">
                        <Button variant="light" onClick={goToPreviousDay}>
                            <BiLeftArrow />
                        </Button>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            customInput={<Button variant="outline-dark">{selectedDate.toLocaleDateString()}</Button>}
                        />
                        <Button variant="light" onClick={goToNextDay}>
                            <BiRightArrow />
                        </Button>
                    </div>

                    <div className="mt-4">{renderMatchesByLeague()}</div>
                </Col>
            </Row>
        </Container>
    );

};

export default MainView;
