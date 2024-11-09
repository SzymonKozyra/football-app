import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import '../App.css';

const PlayerSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [players, setPlayers] = useState([]);
    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        picture: '',
        positionId: '',
        countryId: '',
        clubId: '',
        nationalTeamId: '',
        value: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8080/api/positions', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(res => setPositions(res.data))
            .catch(error => console.error('Error fetching positions:', error));

        axios.get('http://localhost:8080/api/countries')
            .then(res => setCountries(res.data));

        axios.get('http://localhost:8080/api/teams', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(res => setTeams(res.data))
            .catch(error => console.error('Error fetching teams:', error));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/api/players/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setPlayers(response.data))
            .catch(error => console.error('Error fetching players:', error));
    };

    const handleEditClick = (player) => {
        setSelectedPlayer(player);
        setEditData({
            firstName: player.firstName,
            lastName: player.lastName,
            dateOfBirth: player.dateOfBirth,
            nickname: player.nickname,
            picture: player.picture,
            positionId: player.position.id,
            countryId: player.country.id,
            clubId: player.club ? player.club.id : '',
            nationalTeamId: player.nationalTeam ? player.nationalTeam.id : '',
            value: player.value
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.put(`http://localhost:8080/api/players/${selectedPlayer.id}`, editData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('Player updated successfully');
                setSelectedPlayer(null);
            })
            .catch(error => {
                console.error('Error updating player:', error);
                alert('Failed to update player');
            });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search Player</h1>
            <Form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
                <Form.Control
                    type="text"
                    placeholder="Enter first or last name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="me-2"
                    style={{ maxWidth: '400px' }}
                />
                <Button variant="primary" type="submit">Search</Button>
            </Form>

            {players.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-center mb-3">Players found:</h3>
                    <Container>
                        {players.map(player => (
                            <Card key={player.id} className="mb-3 shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>ID:</strong> {player.id}<br />
                                        <strong>Name:</strong> {player.firstName} {player.lastName}<br />
                                        <strong>Position:</strong> {player.position.abbreviation}<br />
                                        <strong>Country:</strong> {player.country.name}<br />
                                        <strong>Club:</strong> {player.club ? player.club.name : 'N/A'}<br />
                                        <strong>National Team:</strong> {player.nationalTeam ? player.nationalTeam.name : 'N/A'}<br />
                                        <strong>Nickname:</strong> {player.nickname || 'N/A'}<br />
                                        <strong>Picture:</strong> {player.picture}<br />
                                        <strong>Value:</strong> ${player.value ? player.value.toFixed(2) : '0.00'}<br />
                                        <strong>Date of Birth:</strong> {player.dateOfBirth}
                                    </div>
                                    <Button variant="outline-primary" onClick={() => handleEditClick(player)}>Edit</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </div>
            )}

            {selectedPlayer && (
                <div className="p-4 border rounded shadow-sm bg-light">
                    <h3 className="text-center mb-4">Edit Player: {selectedPlayer.firstName} {selectedPlayer.lastName}</h3>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formFirstName" className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.firstName}
                                onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.lastName}
                                onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateOfBirth" className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                value={editData.dateOfBirth}
                                onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNickname" className="mb-3">
                            <Form.Label>Nickname</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.nickname}
                                onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPicture" className="mb-3">
                            <Form.Label>Picture</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.picture}
                                onChange={(e) => setEditData({ ...editData, picture: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPosition" className="mb-3">
                            <Form.Label>Position</Form.Label>
                            <Form.Select
                                value={editData.positionId}
                                onChange={(e) => setEditData({ ...editData, positionId: e.target.value })}
                            >
                                <option value="">Select Position</option>
                                {positions.map(position => (
                                    <option key={position.id} value={position.id}>
                                        {position.abbreviation}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formCountry" className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                                value={editData.countryId}
                                onChange={(e) => setEditData({ ...editData, countryId: e.target.value })}
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formClubId" className="mb-3">
                            <Form.Label>Club ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.clubId}
                                onChange={(e) => setEditData({ ...editData, clubId: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNationalTeamId" className="mb-3">
                            <Form.Label>National Team ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.nationalTeamId}
                                onChange={(e) => setEditData({ ...editData, nationalTeamId: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formValue" className="mb-3">
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                                type="number"
                                value={editData.value}
                                onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default PlayerSearchAndEditForm;
