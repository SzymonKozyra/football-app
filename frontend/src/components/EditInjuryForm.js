import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, ListGroup, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditInjuryForm = () => {
    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [injuries, setInjuries] = useState([]);
    const [selectedInjury, setSelectedInjury] = useState(null);
    const [injuryType, setInjuryType] = useState('');
    const [injuryStartDate, setInjuryStartDate] = useState('');
    const [injuryEndDate, setInjuryEndDate] = useState('');
    const [error, setError] = useState(null);

    const resetForm = () => {
        setInjuryType('');
        setInjuryStartDate('');
        setInjuryEndDate('');
        setSelectedInjury(null);
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Fetch players based on search query
    useEffect(() => {
        if (playerSearchQuery) {
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/players/search?query=${playerSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setFilteredPlayers(response.data))
                .catch(error => {
                    console.error('Error fetching players:', error);
                    setError('Failed to load players.');
                });
        } else {
            setFilteredPlayers([]);
        }
    }, [playerSearchQuery]);

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
        setPlayerSearchQuery(`${player.firstName} ${player.lastName}`);
        setFilteredPlayers([]);
    };

    const handleSearch = () => {
        if (selectedPlayer) {
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/injuries/player/${selectedPlayer.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setInjuries(response.data))
                .catch(error => {
                    console.error('Error fetching injuries:', error);
                    setError('Failed to load injuries.');
                });
        } else {
            setError("Please select a player first.");
        }
    };

    const handleInjurySelect = (injury) => {
        setSelectedInjury(injury);
        setInjuryType(injury.type);
        setInjuryStartDate(injury.startDate);
        setInjuryEndDate(injury.endDate);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (!token || !selectedInjury) {
            console.error('Authorization token or injury not selected');
            return;
        }

        const injuryData = {
            playerId: selectedPlayer.id,
            type: injuryType,
            startDate: injuryStartDate,
            endDate: injuryEndDate
        };

        axios.put(`http://localhost:8080/api/injuries/${selectedInjury.id}`, injuryData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Injury updated successfully');
                resetForm();
            })
            .catch(error => {
                console.error('Error updating injury:', error);
                setError('Failed to update injury.');
            });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Edit Injury</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <Form className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Search for Player</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter player name"
                        value={playerSearchQuery}
                        onChange={(e) => setPlayerSearchQuery(e.target.value)}
                    />
                </Form.Group>

                {filteredPlayers.length > 0 && (
                    <ListGroup className="mb-3">
                        {filteredPlayers.map(player => (
                            <ListGroup.Item
                                key={player.id}
                                onClick={() => handlePlayerSelect(player)}
                                style={{ cursor: 'pointer' }}
                            >
                                {player.firstName} {player.lastName}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}

                <Button variant="primary" onClick={handleSearch}>Search</Button>
            </Form>

            {selectedPlayer && injuries.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-center mb-3">Injuries of {selectedPlayer.firstName} {selectedPlayer.lastName}</h3>
                    <Container>
                        {injuries.map(injury => (
                            <Card key={injury.id} className="mb-3 shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>Type:</strong> {injury.type}<br />
                                        <strong>Start Date:</strong> {injury.startDate}<br />
                                        <strong>End Date:</strong> {injury.endDate || 'Present'}
                                    </div>
                                    <Button variant="outline-primary" onClick={() => handleInjurySelect(injury)}>Edit</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </div>
            )}

            {selectedInjury && (
                <div className="p-4 border rounded shadow-sm bg-light mt-4">
                    <h3 className="text-center mb-4">Edit Injury</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formInjuryType" className="mb-3">
                            <Form.Label>Injury Type</Form.Label>
                            <Form.Control
                                type="text"
                                value={injuryType}
                                onChange={(e) => setInjuryType(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formInjuryStartDate" className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                max={getTodayDate()}
                                value={injuryStartDate}
                                onChange={(e) => setInjuryStartDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formInjuryEndDate" className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                min={injuryStartDate}
                                value={injuryEndDate}
                                onChange={(e) => setInjuryEndDate(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default EditInjuryForm;
