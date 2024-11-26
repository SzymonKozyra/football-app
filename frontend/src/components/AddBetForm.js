//import React, { useState } from "react";
//import axios from "axios";
//
//const AddBetForm = ({ matchId, onBetAdded }) => {
//  const [homeScore, setHomeScore] = useState("");
//  const [awayScore, setAwayScore] = useState("");
//  const [error, setError] = useState("");
//
//  const handleSubmit = async (e) => {
//    e.preventDefault();
//    try {
//      const response = await axios.post(
//        `/api/bets/add/${matchId}`,
//        {},
//        {
//          params: {
//            homeScore: homeScore,
//            awayScore: awayScore,
//          },
//          headers: {
//            Authorization: `Bearer ${localStorage.getItem("token")}`,
//          },
//        }
//      );
//      onBetAdded(response.data);
//      setHomeScore("");
//      setAwayScore("");
//      setError("");
//    } catch (err) {
//      setError(err.response?.data?.message || "Error while adding bet");
//    }
//  };
//
//  return (
//    <form onSubmit={handleSubmit}>
//      <div>
//        <label>Home Score</label>
//        <input
//          type="number"
//          value={homeScore}
//          onChange={(e) => setHomeScore(e.target.value)}
//          required
//        />
//      </div>
//      <div>
//        <label>Away Score</label>
//        <input
//          type="number"
//          value={awayScore}
//          onChange={(e) => setAwayScore(e.target.value)}
//          required
//        />
//      </div>
//      {error && <p style={{ color: "red" }}>{error}</p>}
//      <button type="submit">Add Bet</button>
//    </form>
//  );
//};
//
//export default AddBetForm;




//      NIE DZIALA WYSZUKIWANIE PO DRUZYNIE
//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
//
//const AddBetForm = () => {
//    const [matchSearchQuery, setMatchSearchQuery] = useState('');
//    const [filteredMatches, setFilteredMatches] = useState([]);
//    const [selectedMatch, setSelectedMatch] = useState(null);
//    const [homeScore, setHomeScore] = useState('');
//    const [awayScore, setAwayScore] = useState('');
//
//    const handleMatchSearch = (e) => {
//        setMatchSearchQuery(e.target.value);
//    };
//
//    const handleMatchSelect = (match) => {
//        setSelectedMatch(match);
//        setMatchSearchQuery(`${match.homeTeam.name} vs ${match.awayTeam.name}`);
//        setFilteredMatches([]);
//    };
//
//    useEffect(() => {
//        if (matchSearchQuery) {
//            const token = localStorage.getItem('jwtToken');
//            axios
//                .get(`http://localhost:8080/api/matches/search?query=${matchSearchQuery}`, {
//                    headers: { Authorization: `Bearer ${token}` },
//                })
//                .then((response) => {
//                    setFilteredMatches(response.data);
//                })
//                .catch((error) => console.error('Error fetching matches:', error));
//        } else {
//            setFilteredMatches([]);
//        }
//    }, [matchSearchQuery]);
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//        const betData = {
//            matchId: selectedMatch.id,
//            homeScore: parseInt(homeScore, 10),
//            awayScore: parseInt(awayScore, 10),
//        };
//
//        axios
//            .post('http://localhost:8080/api/bets/place', betData, {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            .then((response) => {
//                alert('Bet placed successfully!');
//                setSelectedMatch(null);
//                setMatchSearchQuery('');
//                setHomeScore('');
//                setAwayScore('');
//            })
//            .catch((error) => {
//                console.error('Error placing bet:', error);
//                alert('Failed to place the bet. You might have already placed a bet for this match.');
//            });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Place Bet</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//                <Form.Group controlId="formMatchSearch" className="mb-3">
//                    <Form.Label>Search for a Match</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search by team names"
//                        value={matchSearchQuery}
//                        onChange={handleMatchSearch}
//                        required
//                    />
//                    {filteredMatches.length > 0 && (
//                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                            {filteredMatches.map((match) => (
//                                <ListGroup.Item
//                                    key={match.id}
//                                    action
//                                    onClick={() => handleMatchSelect(match)}
//                                >
//                                    {match.homeTeam.name} vs {match.awayTeam.name} ({match.dateTime})
//                                </ListGroup.Item>
//                            ))}
//                        </ListGroup>
//                    )}
//                </Form.Group>
//
//                {selectedMatch && (
//                    <div className="mb-3">
//                        <h5 className="text-center">
//                            Selected Match: {selectedMatch.homeTeam.name} vs{' '}
//                            {selectedMatch.awayTeam.name}
//                        </h5>
//                    </div>
//                )}
//
//                <Row>
//                    <Col>
//                        <Form.Group controlId="formHomeScore" className="mb-3">
//                            <Form.Label>Home Team Score</Form.Label>
//                            <Form.Control
//                                type="number"
//                                value={homeScore}
//                                onChange={(e) => setHomeScore(e.target.value)}
//                                required
//                            />
//                        </Form.Group>
//                    </Col>
//                    <Col>
//                        <Form.Group controlId="formAwayScore" className="mb-3">
//                            <Form.Label>Away Team Score</Form.Label>
//                            <Form.Control
//                                type="number"
//                                value={awayScore}
//                                onChange={(e) => setAwayScore(e.target.value)}
//                                required
//                            />
//                        </Form.Group>
//                    </Col>
//                </Row>
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">
//                    Place Bet
//                </Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddBetForm;







//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
//
//const AddBetForm = () => {
//    const [matchSearchQuery, setMatchSearchQuery] = useState('');
//    const [filteredMatches, setFilteredMatches] = useState([]);
//    const [selectedMatch, setSelectedMatch] = useState(null);
//    const [homeScore, setHomeScore] = useState('');
//    const [awayScore, setAwayScore] = useState('');
//
//    // Obsługa zmiany tekstu w polu wyszukiwania
//    const handleMatchSearch = (e) => {
//        setMatchSearchQuery(e.target.value);
//    };
//
//    // Wybór meczu z listy wyników
//    const handleMatchSelect = (match) => {
//        setSelectedMatch(match);
//        setMatchSearchQuery(`${match.homeTeam.name} vs ${match.awayTeam.name}`);
//        setFilteredMatches([]);
//    };
//
//    // Efekt do wyszukiwania meczów
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        if (matchSearchQuery && token) {
//            axios
//                .get(`http://localhost:8080/api/matches/search?query=${matchSearchQuery}`, {
//                    headers: { Authorization: `Bearer ${token}` },
//                })
//                .then((response) => {
//                    setFilteredMatches(response.data);
//                })
//                .catch((error) => {
//                    console.error('Error fetching matches:', error);
//                    setFilteredMatches([]);
//                });
//        } else {
//            setFilteredMatches([]);
//        }
//    }, [matchSearchQuery]);
//
//    // Obsługa przesłania formularza
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        if (!selectedMatch) {
//            alert('Please select a match before placing a bet.');
//            return;
//        }
//
//        const betData = {
//            matchId: selectedMatch.id,
//            homeScore: parseInt(homeScore, 10),
//            awayScore: parseInt(awayScore, 10),
//        };
//
//        axios
//            .post('http://localhost:8080/api/bets/place', betData, {
//                headers: { Authorization: `Bearer ${token}` },
//            })
//            .then(() => {
//                alert('Bet placed successfully!');
//                setSelectedMatch(null);
//                setMatchSearchQuery('');
//                setHomeScore('');
//                setAwayScore('');
//            })
//            .catch((error) => {
//                console.error('Error placing bet:', error);
//                alert('Failed to place the bet. You might have already placed a bet for this match.');
//            });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Place Bet</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//                <Form.Group controlId="formMatchSearch" className="mb-3">
//                    <Form.Label>Search for a Match</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search by team names"
//                        value={matchSearchQuery}
//                        onChange={handleMatchSearch}
//                        required
//                    />
//                    {filteredMatches.length > 0 && (
//                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                            {filteredMatches.map((match) => (
//                                <ListGroup.Item
//                                    key={match.id}
//                                    action
//                                    onClick={() => handleMatchSelect(match)}
//                                >
//                                    {match.homeTeam.name} vs {match.awayTeam.name} ({match.dateTime})
//                                </ListGroup.Item>
//                            ))}
//                        </ListGroup>
//                    )}
//                </Form.Group>
//
//                {selectedMatch && (
//                    <div className="mb-3">
//                        <h5 className="text-center">
//                            Selected Match: {selectedMatch.homeTeam.name} vs{' '}
//                            {selectedMatch.awayTeam.name}
//                        </h5>
//                    </div>
//                )}
//
//                <Row>
//                    <Col>
//                        <Form.Group controlId="formHomeScore" className="mb-3">
//                            <Form.Label>Home Team Score</Form.Label>
//                            <Form.Control
//                                type="number"
//                                value={homeScore}
//                                onChange={(e) => setHomeScore(e.target.value)}
//                                required
//                            />
//                        </Form.Group>
//                    </Col>
//                    <Col>
//                        <Form.Group controlId="formAwayScore" className="mb-3">
//                            <Form.Label>Away Team Score</Form.Label>
//                            <Form.Control
//                                type="number"
//                                value={awayScore}
//                                onChange={(e) => setAwayScore(e.target.value)}
//                                required
//                            />
//                        </Form.Group>
//                    </Col>
//                </Row>
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">
//                    Place Bet
//                </Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddBetForm;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, ListGroup } from 'react-bootstrap';

const BASE_URL = 'http://localhost:8080';

const AddBetForm = () => {
    const [matchSearchQuery, setMatchSearchQuery] = useState('');
    const [filteredMatches, setFilteredMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [homeScore, setHomeScore] = useState('');
    const [awayScore, setAwayScore] = useState('');
    const [userId, setUserId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

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
        }else{
            console.error("JWT token is missing.");
            return;
        }
    }, [token]);

    const handleMatchSearch = (e) => {
        setMatchSearchQuery(e.target.value);
    };

    const handleMatchSelect = (match) => {
        setSelectedMatch(match);
        setMatchSearchQuery(`${match.homeTeam.name} vs ${match.awayTeam.name}`);
        setFilteredMatches([]);
    };

    useEffect(() => {
        if (matchSearchQuery) {
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/matches/search?query=${matchSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((response) => setFilteredMatches(response.data))
            .catch((error) => console.error('Error fetching matches:', error));
        } else {
            setFilteredMatches([]);
        }
    }, [matchSearchQuery]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!selectedMatch) {
            alert('Please select a match before placing a bet.');
            return;
        }

        const betData = {
            matchId: selectedMatch.id,
            userId: userId,
//            homeScore: parseInt(homeScore, 10),
//            awayScore: parseInt(awayScore, 10),
            homeScore,
            awayScore,
        };

        axios.post('http://localhost:8080/api/bets/add', betData, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            alert('Bet placed successfully!');
            setSelectedMatch(null);
            setMatchSearchQuery('');
            setHomeScore('');
            setAwayScore('');
        })
        .catch((error) => console.error('Error placing bet:', error));
    };

    return (
        <Container>
            <h1>Place Bet</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Search for Match</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search match by team name"
                        value={matchSearchQuery}
                        onChange={handleMatchSearch}
                    />
                    {filteredMatches.length > 0 && (
                        <ListGroup>
                            {filteredMatches.map((match) => (
                                <ListGroup.Item
                                    key={match.id}
                                    onClick={() => handleMatchSelect(match)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {match.homeTeam.name} vs {match.awayTeam.name} ({match.dateTime})
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>
                {selectedMatch && (
                    <>
                        <h5>Selected Match: {selectedMatch.homeTeam.name} vs {selectedMatch.awayTeam.name}</h5>
                        <Form.Group>
                            <Form.Label>Home Team Score</Form.Label>
                            <Form.Control
                                type="number"
                                value={homeScore}
                                onChange={(e) => setHomeScore(e.target.value)}
                                required
                                min='0'
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Away Team Score</Form.Label>
                            <Form.Control
                                type="number"
                                value={awayScore}
                                onChange={(e) => setAwayScore(e.target.value)}
                                required
                                min='0'
                            />
                        </Form.Group>
                    </>
                )}
                <Button type="submit" disabled={!selectedMatch}>Place Bet</Button>
            </Form>
        </Container>
    );
};

export default AddBetForm;


