import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, ListGroup } from 'react-bootstrap';

const EditBetForm = ({ betId, onClose }) => {
    const [betDetails, setBetDetails] = useState(null);
    const [homeScore, setHomeScore] = useState('');
    const [awayScore, setAwayScore] = useState('');
    const [matchDetails, setMatchDetails] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (betId) {
            axios
                .get(`http://localhost:8080/api/bets/${betId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    setBetDetails(response.data);
                    setHomeScore(response.data.homeScore);
                    setAwayScore(response.data.awayScore);
                    setMatchDetails(response.data.match);
                })
                .catch((error) => console.error('Error fetching bet details:', error));
        }
    }, [betId]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const updatedBet = {
            homeScore: parseInt(homeScore, 10),
            awayScore: parseInt(awayScore, 10),
        };

        axios
            .put(`http://localhost:8080/api/bets/${betId}/edit`, updatedBet, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then(() => {
                alert('Bet updated successfully!');
                onClose();
            })
            .catch((error) => {
                console.error('Error updating bet:', error);
                alert('Failed to update the bet.');
            });
    };

    if (!betDetails || !matchDetails) {
        return <p>Loading bet details...</p>;
    }

    return (
        <Container className="mt-4">
            <h2>Edit Bet</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Match</Form.Label>
                    <Form.Control
                        type="text"
                        value={`${matchDetails.homeTeam.name} vs ${matchDetails.awayTeam.name}`}
                        readOnly
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Home Team Score</Form.Label>
                    <Form.Control
                        type="number"
                        value={homeScore}
                        onChange={(e) => setHomeScore(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>Away Team Score</Form.Label>
                    <Form.Control
                        type="number"
                        value={awayScore}
                        onChange={(e) => setAwayScore(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Update Bet
                </Button>
                <Button variant="secondary" className="ms-2" onClick={onClose}>
                    Cancel
                </Button>
            </Form>
        </Container>
    );
};

export default EditBetForm;
