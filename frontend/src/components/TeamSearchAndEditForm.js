import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import TeamImage from "./TeamImage";

const TeamSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [noResultsMessage, setNoResultsMessage] = useState('');
    const [editData, setEditData] = useState({
        id: '',
        name: '',
        picture: '',
        leagueId: '',
        isClub: true,
    });
    const [pictureFile, setPictureFile] = useState(null);

    const [leagueSearchQuery, setLeagueSearchQuery] = useState('');
    const [filteredLeagues, setFilteredLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [isEditingLeague, setIsEditingLeague] = useState(false); // Track if the user is editing the league

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (isEditingLeague && leagueSearchQuery && token) {
            axios.get(`http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setFilteredLeagues(response.data))
                .catch(error => console.error('Error fetching leagues:', error));
        } else {
            setFilteredLeagues([]);
        }
    }, [leagueSearchQuery, isEditingLeague]);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        setLeagueSearchQuery(league.name);
        setFilteredLeagues([]);
        setIsEditingLeague(true); // Stop showing suggestions after selecting a league
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/api/teams/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                console.log(response.data); // Log the response to check `isClub` values
                setTeams(response.data);
                setNoResultsMessage(response.data.length === 0 ? 'No results found.' : '');
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    };

    const handleEditClick = (team) => {
        setSelectedTeamId(team.id);
        setEditData({
            id: team.id,
            name: team.name,
            picture: team.picture,
            leagueId: team.league ? team.league.id : '',
            isClub: team.club, // Map `club` from backend to `isClub`
        });
        setSelectedLeague(team.league); // Set selected league to the current team league
        setLeagueSearchQuery(team.league ? team.league.name : ''); // Set the search query to the league name
        setIsEditingLeague(false); // Initially, do not show suggestions
        setPictureFile(null);
    };


    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const formData = new FormData();
        formData.append('name', editData.name);
        formData.append('leagueId', selectedLeague ? selectedLeague.id : editData.leagueId);
        formData.append('isClub', editData.isClub);

        if (pictureFile) {
            formData.append('picture', pictureFile);
        }

        axios.put(`http://localhost:8080/api/teams/${selectedTeamId}`, formData, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(() => {
                alert('Team updated successfully');
                setSelectedTeamId(null);
            })
            .catch(error => {
                console.error('Error updating team:', error);
                alert('Failed to update team');
            });
    };

    const handleDelete = (teamId) => {
        const token = localStorage.getItem('jwtToken');

        axios.delete(`http://localhost:8080/api/teams/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('Team deleted successfully');
                setTeams(teams.filter(team => team.id !== teamId));
            })
            .catch(error => {
                console.error('Error deleting team:', error);
                alert('Failed to delete team');
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

            {teams.length > 0 ? (
                <div className="mb-4">
                    <h3 className="text-center mb-3">Teams found:</h3>
                    <Container>
                        {teams.map(team => (
                            <React.Fragment key={team.id}>
                                <Card className="mb-3 shadow-sm">
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col xs="auto">
                                                <TeamImage team={team} />
                                            </Col>
                                            <Col style={{ textAlign: 'left' }}>
                                                <div>
                                                    <strong>ID:</strong> {team.id}<br />
                                                    <strong>Name:</strong> {team.name}<br />
                                                    {console.log(`Team: ${team.name}, isClub: ${team.isClub}`)}
                                                    <strong>Type:</strong> {team.club ? "Club" : "National Team"}<br/>
                                                    <strong>League:</strong> {team.league ? team.league.name : 'No League'}
                                                </div>
                                            </Col>
                                            <Col xs="auto" className="d-flex justify-content-end">
                                                <Button variant="outline-primary" onClick={() => handleEditClick(team)}>Edit</Button>
                                                <Button variant="outline-danger" onClick={() => handleDelete(team.id)} className="ms-2">Delete</Button>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>

                                {selectedTeamId === team.id && (
                                    <div className="p-4 border rounded shadow-sm bg-light mb-3">
                                        <h3 className="text-center mb-4">Edit Team: {team.name}</h3>
                                        <Form onSubmit={handleEditSubmit}>
                                            <Form.Group controlId="formTeamName" className="mb-3">
                                                <Form.Label>Team Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editData.name}
                                                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                                />
                                            </Form.Group>
                                            <Form.Group controlId="formLeagueSearch" className="mb-3">
                                                <Form.Label>Search League</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={leagueSearchQuery}
                                                    onChange={(e) => {
                                                        setLeagueSearchQuery(e.target.value);
                                                        setIsEditingLeague(true);
                                                    }}
                                                    placeholder="Search for a league"
                                                />
                                                {isEditingLeague && filteredLeagues.length > 0 && (
                                                    <ul>
                                                        {filteredLeagues.map((league) => (
                                                            <li key={league.id} onClick={() => handleLeagueSelect(league)}>
                                                                {league.name}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </Form.Group>
                                            <Form.Group controlId="formIsClub" className="mb-3">
                                                <Form.Label>Is Club?</Form.Label>
                                                <Form.Select
                                                    value={editData.isClub ? 'true' : 'false'}
                                                    onChange={(e) => setEditData({ ...editData, isClub: e.target.value === 'true' })}
                                                >
                                                    <option value="true">Yes</option>
                                                    <option value="false">No</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group controlId="formPicture" className="mb-3">
                                                <Form.Label>Upload New Picture</Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setPictureFile(e.target.files[0])}
                                                />
                                            </Form.Group>
                                            <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                                        </Form>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </Container>
                </div>
            ) : (
                <p className="text-center">{noResultsMessage}</p>
            )}
        </Container>
    );
};

export default TeamSearchAndEditForm;
