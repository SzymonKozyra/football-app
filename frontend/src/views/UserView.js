import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, Card, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import FavoriteItems from "../components/FavoriteItems";

const BASE_URL = 'http://localhost:8080';

const UserView = () => {
    const [favorites, setFavorites] = useState({ leagues: [], teams: [] });
    const [allLeagues, setAllLeagues] = useState([]);
    const [sortedLeagues, setSortedLeagues] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        // Fetch all favorites
        axios.get(`${BASE_URL}/api/favorites`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => setFavorites(response.data))
            .catch(error => console.error('Error fetching favorites:', error));

        // Fetch all leagues
        axios.get(`${BASE_URL}/api/leagues`, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setAllLeagues(response.data);
                sortLeagues(response.data, favorites.leagues);
            })
            .catch(error => console.error('Error fetching leagues:', error));
    }, [token]);

    useEffect(() => {
        // Sort leagues whenever allLeagues or favorites.leagues changes
        sortLeagues(allLeagues, favorites.leagues);
    }, [allLeagues, favorites.leagues]);

    const sortLeagues = (leagues, favoriteLeagues) => {
        const favoriteIds = favoriteLeagues.map(fav => fav.league.id);
        const sorted = leagues
            .sort((a, b) => {
                const aIsFavorite = favoriteIds.includes(a.id);
                const bIsFavorite = favoriteIds.includes(b.id);
                if (aIsFavorite && !bIsFavorite) return -1;
                if (!aIsFavorite && bIsFavorite) return 1;
                return a.name.localeCompare(b.name);
            });
        setSortedLeagues(sorted);
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    const toggleFavoriteLeague = (league) => {
        const isFavorite = favorites.leagues.some(fav => fav.league.id === league.id);
        const endpoint = isFavorite
            ? `${BASE_URL}/api/favorite-leagues/remove`
            : `${BASE_URL}/api/favorite-leagues/add`;

        axios.post(endpoint, { leagueId: league.id }, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                // Refetch favorites after updating
                axios.get(`${BASE_URL}/api/favorites`, { headers: { Authorization: `Bearer ${token}` } })
                    .then(response => setFavorites(response.data))
                    .catch(error => console.error('Error refreshing favorites:', error));
            })
            .catch(error => console.error('Error toggling favorite league:', error));
    };

    const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}`;

    // return (
    //     <Container fluid>
    //         <Row>
    //             {/* Sidebar */}
    //             <Col md={3} className="bg-light vh-100 p-3">
    //                 <h5>Navigation</h5>
    //                 <ListGroup variant="flush">
    //                     <ListGroup.Item>
    //                         <strong>Favorite Leagues</strong>
    //                         <ListGroup className="mt-2">
    //                             {favorites.leagues.map(fav => (
    //                                 <ListGroup.Item key={fav.league.id} className="d-flex align-items-center">
    //                                     <img
    //                                         src={`/assets/flags/${fav.league.country.code}.svg`}
    //                                         alt={fav.league.country.name}
    //                                         style={{ width: 20, height: 20, marginRight: 10 }}
    //                                     />
    //                                     {fav.league.name}
    //                                 </ListGroup.Item>
    //                             ))}
    //                         </ListGroup>
    //                     </ListGroup.Item>
    //                     <ListGroup.Item>
    //                         <strong>Favorite Teams</strong>
    //                         <ListGroup className="mt-2">
    //                             {favorites.teams.map(fav => (
    //                                 <ListGroup.Item key={fav.team.id} className="d-flex align-items-center">
    //                                     <img
    //                                         src={`/assets/img/teams/${fav.team.picture}`}
    //                                         alt={fav.team.name}
    //                                         style={{ width: 20, height: 20, marginRight: 10 }}
    //                                     />
    //                                     {fav.team.name}
    //                                 </ListGroup.Item>
    //                             ))}
    //                         </ListGroup>
    //                     </ListGroup.Item>
    //                 </ListGroup>
    //             </Col>
    //
    //             {/* Main Content */}
    //             <Col md={9} className="p-3">
    //                 <div className="d-flex align-items-center mb-3">
    //                     <Button
    //                         variant="outline-primary"
    //                         onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() - 1)))}
    //                     >
    //                         &lt;
    //                     </Button>
    //                     <Button variant="outline-secondary" className="mx-3" onClick={() => handleDateChange(new Date())}>
    //                         {formattedDate}
    //                     </Button>
    //                     <Button
    //                         variant="outline-primary"
    //                         onClick={() => handleDateChange(new Date(selectedDate.setDate(selectedDate.getDate() + 1)))}
    //                     >
    //                         &gt;
    //                     </Button>
    //                 </div>
    //                 <Row>
    //                     {sortedLeagues.map(league => (
    //                         <Col key={league.id} md={4} className="mb-4">
    //                             <Card>
    //                                 <Card.Body className="d-flex align-items-center">
    //                                     <img
    //                                         src={`/assets/flags/${league.country.code}.svg`}
    //                                         alt={league.country.name}
    //                                         style={{ width: 20, height: 20, marginRight: 10 }}
    //                                     />
    //                                     <div className="flex-grow-1">{league.name}</div>
    //                                     <Form.Check
    //                                         type="switch"
    //                                         id={`favorite-switch-${league.id}`}
    //                                         checked={favorites.leagues.some(fav => fav.league.id === league.id)}
    //                                         onChange={() => toggleFavoriteLeague(league)}
    //                                         label=""
    //                                     />
    //                                 </Card.Body>
    //                             </Card>
    //                         </Col>
    //                     ))}
    //                 </Row>
    //             </Col>
    //         </Row>
    //     </Container>
    // );
    return (
        <FavoriteItems/>
    );
};

export default UserView;
