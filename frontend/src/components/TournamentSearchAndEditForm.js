import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, ListGroup, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const TournamentSearchAndEditForm = () => {
    const [tournamentSearchQuery, setTournamentSearchQuery] = useState('');
    const [filteredTournaments, setFilteredTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [editData, setEditData] = useState({
        name: '',
        edition: ''
    });
    const [isEditionValid, setIsEditionValid] = useState(true);

    // Fetch tournaments based on search query
    useEffect(() => {
        if (tournamentSearchQuery) {
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/tournaments/search?query=${tournamentSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredTournaments(response.data))
            .catch(error => console.error('Error fetching tournaments:', error));
        } else {
            setFilteredTournaments([]);
        }
    }, [tournamentSearchQuery]);

    const handleTournamentSelect = (tournament) => {
        setSelectedTournament(tournament.id);
        setEditData({
            name: tournament.name,
            edition: tournament.edition
        });
        setFilteredTournaments([]);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!isEditionValid) {
            alert("Invalid edition format. Please use the format XX/XX.");
            return;
        }

        const token = localStorage.getItem('jwtToken');
        axios.put(`http://localhost:8080/api/tournaments/${selectedTournament}`, editData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Tournament updated successfully');
            setSelectedTournament(null);
        })
        .catch(error => {
            console.error('Error updating tournament:', error);
            alert('Failed to update tournament');
        });
    };

    const handleEditionChange = (e) => {
        const value = e.target.value;
        setEditData({ ...editData, edition: value });

        const editionPattern = /^\d{2}\/\d{2}$/;
        setIsEditionValid(editionPattern.test(value));
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search Tournament</h1>

            <Form className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Search for a tournament</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter tournament name"
                        value={tournamentSearchQuery}
                        onChange={(e) => setTournamentSearchQuery(e.target.value)}
                    />
                </Form.Group>

                {filteredTournaments.length > 0 && (
                    <ListGroup className="mb-3">
                        {filteredTournaments.map(tournament => (
                            <ListGroup.Item
                                key={tournament.id}
                                onClick={() => handleTournamentSelect(tournament)}
                                style={{ cursor: 'pointer' }}
                            >
                                {tournament.name} ({tournament.edition})
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}
            </Form>

            {selectedTournament && (
                <div className="p-4 border rounded shadow-sm bg-light mb-3">
                    <h3 className="text-center mb-4">Edit Tournament</h3>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formTournamentName" className="mb-3">
                            <Form.Label>Tournament Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEdition" className="mb-3">
                            <Form.Label>Edition (e.g., 23/24)</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.edition}
                                onChange={handleEditionChange}
                                isInvalid={!isEditionValid}
                                placeholder="Format: XX/XX"
                                required
                            />
                            {!isEditionValid && (
                                <Form.Text className="text-danger">
                                    Please use the format XX/XX.
                                </Form.Text>
                            )}
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default TournamentSearchAndEditForm;
