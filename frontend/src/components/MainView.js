import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const BASE_URL = 'http://localhost:8080';

const MainView = () => {
    const [favorites, setFavorites] = useState({ leagues: [], teams: [] });
    const [matches, setMatches] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        // Pobieranie ulubionych lig i drużyn
        axios.get(`${BASE_URL}/api/favorites`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setFavorites(response.data))
            .catch(error => console.error('Error fetching favorites:', error));
    }, [token]);

    useEffect(() => {
        // Pobieranie meczów dla wybranej daty
        const formattedDate = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
        axios.get(`${BASE_URL}/api/matches/date/${formattedDate}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setMatches(response.data))
            .catch(error => console.error('Error fetching matches:', error));
    }, [selectedDate, token]);

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
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
        // Grupowanie meczów według lig, ulubione ligi na początku
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

    return (
        <Container fluid>
            <Row>
                {/* Pasek ulubionych */}
                <Col xs={3} className="bg-light border-right">
                    <h5 className="mt-4">Ulubione rozgrywki</h5>
                    <ListGroup>
                        {favorites.leagues.map(league => (
                            <ListGroup.Item key={league.id}>{league.name}</ListGroup.Item>
                        ))}
                    </ListGroup>

                    <h5 className="mt-4">Ulubione drużyny</h5>
                    <ListGroup>
                        {favorites.teams.map(team => (
                            <ListGroup.Item key={team.id}>{team.name}</ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* Główny widok */}
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
