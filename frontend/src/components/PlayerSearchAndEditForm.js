import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import PlayerImage from "./PlayerImage";

const PlayerSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [players, setPlayers] = useState([]);
    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        positionId: '',
        countryId: '',
        value: ''
    });
    const [pictureFile, setPictureFile] = useState(null); // State for the uploaded image file

    useEffect(() => {
        axios.get('http://localhost:8080/api/positions', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(res => setPositions(res.data))
            .catch(error => console.error('Error fetching positions:', error));

        axios.get('http://localhost:8080/api/countries')
            .then(res => setCountries(res.data))
            .catch(error => console.error('Error fetching countries:', error));
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
            positionId: player.position.id,
            countryId: player.country.id,
            value: player.value
        });
        setPictureFile(null); // Reset picture file when opening a new edit form
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const formData = new FormData();
        formData.append('firstName', editData.firstName);
        formData.append('lastName', editData.lastName);
        formData.append('dateOfBirth', editData.dateOfBirth);
        formData.append('nickname', editData.nickname);
        formData.append('positionId', editData.positionId);
        formData.append('countryId', editData.countryId);
        formData.append('value', editData.value);

        // Append the picture file only if a new one was uploaded
        if (pictureFile) {
            formData.append('picture', pictureFile);
        }

        axios.put(`http://localhost:8080/api/players/${selectedPlayer.id}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
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
                                <Card.Body>
                                    <Row className="align-items-center">
                                        <Col xs="auto">
                                            <div style={{
                                                display: 'inline-block',
                                                backgroundColor: '#f0f0f0',
                                                padding: '6px',
                                                borderRadius: '4px',
                                                boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.2)'
                                            }}>
                                                <PlayerImage player={player} />
                                            </div>
                                        </Col>
                                        <Col style={{ textAlign: 'left' }}>
                                            <div>
                                                <strong>ID:</strong> {player.id}<br />
                                                <strong>Name:</strong> {player.firstName} {player.lastName}<br />
                                                <strong>Position:</strong> {player.position.abbreviation}<br />
                                                <strong>Country:</strong> {player.country.name}<br />
                                                <strong>Nickname:</strong> {player.nickname || 'N/A'}<br />
                                                <strong>Value:</strong> ${player.value ? player.value.toFixed(2) : '0.00'}<br />
                                                <strong>Date of Birth:</strong> {player.dateOfBirth}
                                            </div>
                                        </Col>
                                        <Col xs="auto" className="d-flex justify-content-end">
                                            <Button variant="outline-primary" onClick={() => handleEditClick(player)}>Edit</Button>
                                        </Col>
                                    </Row>
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
                            <Form.Label>Upload Picture</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPictureFile(e.target.files[0])}
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
