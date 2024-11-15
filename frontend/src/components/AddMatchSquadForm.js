//import React, { useState } from 'react';
//import axios from 'axios';
//import { Form, Button, Container } from 'react-bootstrap';
//import { useNavigate, useParams } from 'react-router-dom';
//
//const AddMatchSquadForm = () => {
//    const navigate = useNavigate();
//    const { matchId } = useParams();
//    const [teamId, setTeamId] = useState('');
//    const [type, setType] = useState('home'); // 'home' or 'away'
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const matchSquadData = {
//            matchId,
//            teamId,
//            type
//        };
//
//        axios.post('http://localhost:8080/api/match-squad/add', matchSquadData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            alert('Match squad added successfully');
//            navigate(`/add-players-match-squad/${response.data.id}`); // Navigate to PlayersMatchSquad form
//        })
//        .catch(error => {
//            console.error('Error adding match squad:', error);
//            alert('Failed to add match squad');
//        });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Add Match Squad</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//                <Form.Group controlId="formTeamId" className="mb-3">
//                    <Form.Label>Team ID</Form.Label>
//                    <Form.Control
//                        type="text"
//                        value={teamId}
//                        onChange={(e) => setTeamId(e.target.value)}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formType" className="mb-3">
//                    <Form.Label>Type</Form.Label>
//                    <Form.Control
//                        as="select"
//                        value={type}
//                        onChange={(e) => setType(e.target.value)}
//                        required
//                    >
//                        <option value="home">Home</option>
//                        <option value="away">Away</option>
//                    </Form.Control>
//                </Form.Group>
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">Add Match Squad</Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddMatchSquadForm;





import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, ListGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';

const AddMatchSquadForm = () => {
    const navigate = useNavigate();
    const { matchId } = useParams();

    const [teamSearchQuery, setTeamSearchQuery] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const [type, setType] = useState('home'); // 'home' or 'away'

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (teamSearchQuery && token) {
            axios.get(`http://localhost:8080/api/teams/search?query=${teamSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredTeams(response.data))
            .catch(error => console.error('Error fetching teams:', error));
        } else {
            setFilteredTeams([]);
        }
    }, [teamSearchQuery]);

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        setTeamSearchQuery(team.name);
        setFilteredTeams([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (!selectedTeam) {
            alert('Please select a team!');
            return;
        }

        const matchSquadData = {
            matchId,
            teamId: selectedTeam.id,
            type
        };

        axios.post('http://localhost:8080/api/match-squad/add', matchSquadData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Match squad added successfully');
            navigate(`/add-players-match-squad/${response.data.id}`); // Navigate to PlayersMatchSquad form
        })
        .catch(error => {
            console.error('Error adding match squad:', error);
            alert('Failed to add match squad');
        });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Match Squad</h1>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <Form.Group controlId="formTeamSearch" className="mb-3">
                    <Form.Label>Search Team</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search for a team"
                        value={teamSearchQuery}
                        onChange={(e) => setTeamSearchQuery(e.target.value)}
                    />
                    {filteredTeams.length > 0 && (
                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredTeams.map(team => (
                                <ListGroup.Item
                                    key={team.id}
                                    action
                                    onClick={() => handleTeamSelect(team)}
                                >
                                    {team.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group controlId="formType" className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Control
                        as="select"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="home">Home</option>
                        <option value="away">Away</option>
                    </Form.Control>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">Add Match Squad</Button>
            </Form>
        </Container>
    );
};

export default AddMatchSquadForm;
