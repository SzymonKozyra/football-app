import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Card, Button, Accordion } from 'react-bootstrap';
import { BiLeftArrow, BiRightArrow } from 'react-icons/bi';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TeamImageSmall from "./TeamImageSmall";
import TeamImageVerySmall from "./TeamImageVerySmall";
import { Link } from 'react-router-dom'; // Import React Router Link
import { Modal } from 'react-bootstrap';
import MatchDetail from "./MatchDetail";
import "./MatchDetail.css"; // Dodajemy plik CSS dla stylizacji
import LeagueView from "./LeagueView"; // Import LeagueView component
import {useNavigate} from "react-router-dom";
import Sidebar from "./Sidebar";
const BASE_URL = 'http://localhost:8080';

const MainView = () => {
    const navigate = useNavigate(); // Call useNavigate at the top level

    const [favorites, setFavorites] = useState({
        matches: [],
        leagues: [],
        teams: [],
    });
    const [matches, setMatches] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [userId, setUserId] = useState(null);
    const [isFavoritesReady, setIsFavoritesReady] = useState(false); // Flaga określająca gotowość

    const [allLeagues, setAllLeagues] = useState([]);
    const [allTeams, setAllTeams] = useState([]);

    const [showModal, setShowModal] = useState(false); // Stan dla modala
    const [selectedMatch, setSelectedMatch] = useState(null); // Wybrany mecz dla modala

    const [selectedLeagueId, setSelectedLeagueId] = useState(null); // New state for selected league


    const token = localStorage.getItem('jwtToken');
    useEffect(() => {
        const interval = setInterval(() => {
            setMatches((prevMatches) => [...prevMatches]); // Wymuszamy aktualizację stanu
        }, 60000); // Aktualizuj co minutę

        return () => clearInterval(interval); // Wyczyść interwał po unmount
    }, []);
    useEffect(() => {
        console.log("Favorites state updated:", favorites);
    }, [favorites]);

    useEffect(() => {
        if (selectedLeagueId === null) {
            const fetchMatches = async () => {
                try {
                    const formattedDate = selectedDate.toISOString().split('T')[0];
                    const matchesResponse = await axios.get(`${BASE_URL}/api/matches/date/${formattedDate}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setMatches(matchesResponse.data);
                } catch (error) {
                    console.error("Error fetching matches:", error);
                }
            };
            fetchMatches();
        }
    }, [selectedDate, token, selectedLeagueId]);

    const fetchEventsForMatches = async (matches) => {
        // Fetch events for a list of matches and return updated matches
        return Promise.all(
            matches.map(async (match) => {
                try {
                    const response = await axios.get(`${BASE_URL}/api/events/match/${match.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    return { ...match, events: response.data }; // Add events to match
                } catch (error) {
                    console.error(`Error fetching events for match ${match.id}:`, error);
                    return match; // Return match without events if there's an error
                }
            })
        );
    };


    const calculateMatchMinute = (match) => {
        if (match.status === 'FINISHED') {
            return 'Finished';
        }

        if (match.status === 'IN_PLAY') {
            const startEventTypes = [
                'MATCH_START',
                'SECOND_HALF_START',
                'OT_FIRST_HALF_START',
                'OT_SECOND_HALF_START',
                'PENALTIES_START',
            ];

            if (!match.events || !Array.isArray(match.events)) {
                console.warn(`No events available for match ${match.id}`);
                return "Live"; // Default fallback for matches without events
            }

            // Sort events by date in descending order
            const sortedEvents = [...match.events].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
            const startEvent = sortedEvents.find((event) => startEventTypes.includes(event.type));

            if (startEvent) {
                const startTime = new Date(startEvent.dateTime);
                const now = new Date();
                const diffInMinutes = Math.floor((now - startTime) / 60000) + 1;

                switch (startEvent.type) {
                    case 'MATCH_START':
                        return diffInMinutes <= 45 ? `${diffInMinutes}'` : `45+${diffInMinutes - 45}'`;

                    case 'SECOND_HALF_START':
                        return diffInMinutes <= 45 ? `45+${diffInMinutes}'` : `90+${diffInMinutes - 45}'`;

                    case 'OT_FIRST_HALF_START':
                        return diffInMinutes <= 15 ? `90+${diffInMinutes}'` : `105+${diffInMinutes - 15}'`;

                    case 'OT_SECOND_HALF_START':
                        return diffInMinutes <= 15 ? `105+${diffInMinutes}'` : `120+${diffInMinutes - 15}'`;

                    case 'PENALTIES_START':
                        return 'Penalties';

                    default:
                        return `${diffInMinutes}'`;
                }
            }

            console.warn(`No start event found for match ${match.id}`);
            return "Live"; // Fallback if no start event is found
        }

        return null; // For non-IN_PLAY and non-FINISHED statuses
    };


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

    // Pobranie wszystkich lig i drużyn
    useEffect(() => {
        axios.get(`${BASE_URL}/api/leagues`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setAllLeagues(response.data))
            .catch(error => console.error('Error fetching leagues:', error));

        axios.get(`${BASE_URL}/api/teams`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setAllTeams(response.data))
            .catch(error => console.error('Error fetching teams:', error));
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
    const fetchMatchesAndEvents = async () => {
        try {
            const formattedDate = selectedDate.toISOString().split('T')[0]; // Format YYYY-MM-DD
            const response = await axios.get(`${BASE_URL}/api/matches/date/${formattedDate}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const fetchedMatches = response.data;

            // Fetch events for all matches
            const updatedMatches = await fetchEventsForMatches(fetchedMatches);

            // Update matches
            setMatches(updatedMatches);

            // Sync events with favorites
            setFavorites((prevFavorites) => ({
                ...prevFavorites,
                matches: prevFavorites.matches.map((fav) => {
                    const updatedMatch = updatedMatches.find((match) => match.id === fav.match.id);
                    return {
                        ...fav,
                        match: updatedMatch ? { ...fav.match, events: updatedMatch.events } : fav.match,
                    };
                }),
            }));

            console.log("Updated Matches with Events:", updatedMatches);
        } catch (error) {
            console.error("Error fetching matches and events:", error);
        }
    };



    useEffect(() => {
        // Fetch matches and their events whenever selectedDate changes
        fetchMatchesAndEvents();
    }, [selectedDate, token]);

    // Otwórz modal z wybranym meczem
    const handleMatchClick = (match) => {
        console.log("Match clicked:", match); // Dodaj log
        setSelectedMatch(match);
        setShowModal(true);
    };


    // Zamknij modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedMatch(null);
    };

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

        // Sprawdzenie, czy element jest ulubiony, za pomocą uniwersalnego isFavorite
        const isFavoriteItem = isFavorite(type, item.id);

        const endpointMap = {
            team: isFavoriteItem ? `${BASE_URL}/api/favorite-teams/remove` : `${BASE_URL}/api/favorite-teams/add`,
            league: isFavoriteItem ? `${BASE_URL}/api/favorite-leagues/remove` : `${BASE_URL}/api/favorite-leagues/add`,
            match: isFavoriteItem ? `${BASE_URL}/api/favorite-matches/remove` : `${BASE_URL}/api/favorite-matches/add`
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
            if (isFavoriteItem) {
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
    const isFavorite = (type, id) => {
        const typeMap = {
            matches: (fav) => fav.match.id === id,
            leagues: (fav) => fav.league.id === id,
            teams: (fav) => fav.team.id === id,
        };

        if (!typeMap[type]) {
            console.error(`Invalid type provided: ${type}`);
            return false;
        }

        return favorites[type]?.some(typeMap[type]) || false;
    };

    const handleLeagueClick = (leagueId) => {
        navigate(`/league/${leagueId}`); // Use the navigate function here
        // window.location.reload(); // Wymuszenie przeładowania

    };

    const handleBackToMainView = () => {
        setSelectedLeagueId(null); // Resetuje id ligi i wraca do głównego widoku
    };

    const renderMatchesByLeague = () => {
        const groupedMatches = matches.reduce((acc, match) => {
            const leagueName = match.league.name;
            if (!acc[leagueName]) acc[leagueName] = [];
            acc[leagueName].push(match);
            return acc;
        }, {});

        const sortedLeagues = Object.keys(groupedMatches).sort((a, b) => a.localeCompare(b));

        return sortedLeagues.map((leagueName) => (
            <Card className="mb-4" key={leagueName} style={{ width: '100%', margin: '0 auto' }}>
                <Card.Header className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <i
                            className={`bi ${
                                isFavorite('leagues', groupedMatches[leagueName][0].league.id)
                                    ? 'bi-star-fill text-warning'
                                    : 'bi-star'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleFavorite('leagues', groupedMatches[leagueName][0].league)}
                        ></i>
                        <span style={{ marginRight: '15px' }}></span>
                        <img
                            src={`/assets/flags/${groupedMatches[leagueName][0].league.country.code}.svg`}
                            alt={groupedMatches[leagueName][0].league.country.name}
                            style={{ width: '20px', height: '15px', marginRight: '10px' }}
                        />
                        {leagueName}
                    </div>
                </Card.Header>
                <ListGroup variant="flush">
                    {groupedMatches[leagueName].map((match) => (
                        <ListGroup.Item
                            key={match.id}
                            onClick={() => handleMatchClick(match)}
                            style={{ cursor: 'pointer' }}
                            className="d-flex align-items-center justify-content-between"
                        >
                            <i
                                className={`bi ${
                                    isFavorite('matches', match.id) ? 'bi-star-fill text-warning' : 'bi-star'
                                }`}
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Zapobiegaj zamykaniu modala przy kliknięciu w gwiazdkę
                                    toggleFavorite('matches', match);
                                }}
                            ></i>
                            <span
                                style={{
                                    marginRight: '15px',
                                    marginLeft: '15px',
                                    width: '70px',
                                    textAlign: 'center',
                                    display: 'inline-block',
                                    backgroundColor: match.status === 'IN_PLAY' ? 'rgba(255, 0, 0, 0.6)' : 'transparent',
                                    borderRadius: '5px',
                                    padding: '5px',
                                }}
                            >
        {match.status === 'IN_PLAY'
            ? calculateMatchMinute(match)
            : match.status === 'FINISHED'
                ? 'Finished'
                : new Date(match.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
    </span>
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
                            {match.status === 'IN_PLAY' || match.status === 'FINISHED' ? (
                                <span style={{ marginRight: '40px' }}>
            <div style={{ textAlign: 'right' }}>
                <div>{match.homeGoals}</div>
                <div>{match.awayGoals}</div>
            </div>
        </span>
                            ) : null}
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        ));
    };

    const renderFavorites = () => {
        const favoriteMatchIds = favorites.matches.map((fav) => fav.match.id);
        const favoriteMatches = matches.filter((match) => favoriteMatchIds.includes(match.id));

        if (favoriteMatches.length === 0) {
            return null;
        }

        return (
            <Card className="mb-4 mt-4" style={{ width: '700px', margin: '0 auto' }}>
                <Card.Header className="d-flex align-items-center justify-content-between">
                    <h5 className="mb-0">Ulubione mecze</h5>
                </Card.Header>
                <ListGroup variant="flush">
                    {favoriteMatches.map((match) => (
                        <ListGroup.Item
                            key={match.id}
                            onClick={() => handleMatchClick(match)}
                            style={{ cursor: 'pointer' }}
                            className="d-flex align-items-center justify-content-between"
                        >
                            <i
                                className={`bi ${
                                    isFavorite('matches', match.id) ? 'bi-star-fill text-warning' : 'bi-star'
                                }`}
                                style={{ cursor: 'pointer' }}
                                onClick={(e) => {
                                    e.stopPropagation(); // Zapobiegaj zamykaniu modala przy kliknięciu w gwiazdkę
                                    toggleFavorite('matches', match);
                                }}
                            ></i>
                            <span
                                style={{
                                    marginRight: '15px',
                                    marginLeft: '15px',
                                    width: '70px',
                                    textAlign: 'center',
                                    display: 'inline-block',
                                    backgroundColor: match.status === 'IN_PLAY' ? 'rgba(255, 0, 0, 0.6)' : 'transparent',
                                    borderRadius: '5px',
                                    padding: '5px',
                                }}
                            >
        {match.status === 'IN_PLAY'
            ? calculateMatchMinute(match)
            : match.status === 'FINISHED'
                ? 'Finished'
                : new Date(match.dateTime).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
    </span>
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
                            {match.status === 'IN_PLAY' || match.status === 'FINISHED' ? (
                                <span style={{ marginRight: '40px' }}>
            <div style={{ textAlign: 'right' }}>
                <div>{match.homeGoals}</div>
                <div>{match.awayGoals}</div>
            </div>
        </span>
                            ) : null}
                        </ListGroup.Item>

                    ))}
                </ListGroup>
            </Card>
        );
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

    const renderSidebarContent = () => (
        <>
            <h5>Ulubione rozgrywki</h5>
            <ListGroup>
                {favorites.leagues.map((league, index) => (
                    <ListGroup.Item key={index} className="d-flex align-items-center">
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
                {favorites.teams.map((team) => (
                    <ListGroup.Item key={team.id} className="d-flex align-items-center">
                        <TeamImageVerySmall team={team.team} />
                        <span style={{ marginLeft: '10px' }}>{team.team.name}</span>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <h5 className="mt-4">Wszystkie ligi</h5>
            <ListGroup>
                {allLeagues.map((league) => (
                    <ListGroup.Item key={league.id} className="d-flex justify-content-between align-items-center">
                        {league.name}
                        <i
                            className={`bi ${
                                isFavorite('leagues', league.id) ? 'bi-star-fill text-warning' : 'bi-star'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleFavorite('leagues', league)}
                        ></i>
                    </ListGroup.Item>
                ))}
            </ListGroup>
            <h5 className="mt-4">Wszystkie drużyny</h5>
            <ListGroup>
                {allTeams.map((team) => (
                    <ListGroup.Item key={team.id} className="d-flex justify-content-between align-items-center">
                        {team.name}
                        <i
                            className={`bi ${
                                isFavorite('teams', team.id) ? 'bi-star-fill text-warning' : 'bi-star'
                            }`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => toggleFavorite('teams', team)}
                        ></i>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </>
    );



    return (
        <Container fluid>
            {/* Menu jako Accordion na małych ekranach */}
            <Accordion className="d-md-none mb-3">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Menu</Accordion.Header>
                    <Accordion.Body>{renderSidebarContent()}</Accordion.Body>
                </Accordion.Item>
            </Accordion>

            <Row className="flex-column flex-md-row">
                <Col md={3} className="bg-light border-right order-2 order-md-1">
                    {/* Menu statyczne na dużych ekranach */}
                    <div className="d-none d-md-block">{renderSidebarContent()}</div>
                </Col>

                {/* Główna zawartość */}
                <Col md={9} className="order-1 order-md-2">
                    <div className="d-flex align-items-center justify-content-center mt-4 mb-4">
                        <Button variant="light" onClick={goToPreviousDay} style={{ marginRight: '5px' }}>
                            <BiLeftArrow />
                        </Button>
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="dd/MM/yyyy"
                            customInput={<Button variant="outline-dark">{selectedDate.toLocaleDateString()}</Button>}
                        />
                        <Button variant="light" onClick={goToNextDay} style={{ marginLeft: '5px' }}>
                            <BiRightArrow />
                        </Button>
                    </div>
                    {renderFavorites()}
                    {renderMatchesByLeague()}
                </Col>
            </Row>

            {/* Modal Section */}
            {showModal && (
                <MatchDetail
                    show={showModal}
                    onHide={handleCloseModal}
                    match={selectedMatch}
                    toggleFavorite={toggleFavorite} // Przekazanie toggleFavorite
                    isFavorite={isFavorite} // Przekazanie isFavorite
                />
            )}
        </Container>
    );


};

export default MainView;
