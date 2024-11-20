import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Card, Button } from 'react-bootstrap';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TeamImageSmall from "./TeamImageSmall";

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

    const renderMatchesByLeague = () => {
        const favoriteLeagueIds = favorites.leagues.map(league => league.id);
        const groupedMatches = matches.reduce((acc, match) => {
            const leagueName = match.league.name;
            if (!acc[leagueName]) acc[leagueName] = [];
            acc[leagueName].push(match);
            return acc;
        }, {});

        const sortedLeagues = Object.keys(groupedMatches).sort((a, b) => {
            const isAFavorite = favoriteLeagueIds.includes(groupedMatches[a][0].league.id);
            const isBFavorite = favoriteLeagueIds.includes(groupedMatches[b][0].league.id);
            if (isAFavorite && !isBFavorite) return -1;
            if (!isAFavorite && isBFavorite) return 1;
            return a.localeCompare(b);
        });

        return sortedLeagues.map(leagueName => (
            <Card className="mb-4" key={leagueName}>
                <Card.Header className="d-flex justify-content-between align-items-center">
                    <span>{leagueName}</span>
                </Card.Header>
                <ListGroup variant="flush">
                    {groupedMatches[leagueName].map(match => (
                        <ListGroup.Item key={match.id} className="d-flex justify-content-between align-items-center">
                            <span>
                                {match.time} - {match.homeTeam.name} vs {match.awayTeam.name}
                            </span>
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
                                <TeamImageSmall team={team.team} />
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
