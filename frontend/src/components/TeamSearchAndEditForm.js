import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import '../App.css';

const TeamSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [editData, setEditData] = useState({
        id: '',
        name: '',
        picture: '',
        leagueId: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/api/teams/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    };

    const handleEditClick = (team) => {
        setSelectedTeam(team);
        setEditData({
            id: team.id,
            name: team.name,
            picture: team.picture,
            leagueId: team.league ? team.league.id : ''
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.put(`http://localhost:8080/api/teams/${selectedTeam.id}`, editData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('Team updated successfully');
                setSelectedTeam(null);
            })
            .catch(error => {
                console.error('Error updating team:', error);
                alert('Failed to update team');
            });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search Team</h1>
            <Form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
                <Form.Control
                    type="text"
                    placeholder="Enter team name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="me-2"
                    style={{ maxWidth: '400px' }}
                />
                <Button variant="primary" type="submit">Search</Button>
            </Form>

            {teams.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-center mb-3">Teams found:</h3>
                    <Container>
                        {teams.map(team => (
                            <Card key={team.id} className="mb-3 shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>ID:</strong> {team.id}<br />
                                        <strong>Name:</strong> {team.name}<br />
                                        <strong>Picture:</strong>
                                        <img
                                            src={`/assets/teams/${team.picture}`}
                                            alt={team.name}
                                            className="team-picture mx-2"
                                            style={{ width: '50px', height: '50px' }}
                                        /><br />
                                        <strong>Is Club:</strong> {team.isClub ? "Yes" : "No"}<br />
                                        <strong>League:</strong> {team.league ? team.league.name : 'No League'}<br />
                                    </div>
                                    <Button variant="outline-primary" onClick={() => handleEditClick(team)}>Edit</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </div>
            )}

            {selectedTeam && (
                <div className="p-4 border rounded shadow-sm bg-light">
                    <h3 className="text-center mb-4">Edit Team: {selectedTeam.name}</h3>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formTeamName" className="mb-3">
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPicture" className="mb-3">
                            <Form.Label>Picture</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.picture}
                                onChange={(e) => setEditData({ ...editData, picture: e.target.value })}
                            />
                            <img
                                src={`/assets/teams/${editData.picture}`}
                                alt={editData.name}
                                className="team-picture mt-2"
                                style={{ width: '100px', height: '100px' }}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLeagueId" className="mb-3">
                            <Form.Label>League ID</Form.Label>
                            <Form.Control
                                type="number"
                                value={editData.leagueId}
                                onChange={(e) => setEditData({ ...editData, leagueId: e.target.value })}
                            />

                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default TeamSearchAndEditForm;
