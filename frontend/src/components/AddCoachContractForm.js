import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ListGroup, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddCoachContractForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salary, setSalary] = useState('');
    const [transferFee, setTransferFee] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [teamSearchQuery, setTeamSearchQuery] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (searchQuery) {
            if (selectedCoach && searchQuery !== `${selectedCoach.firstName} ${selectedCoach.lastName}`) {
                setSelectedCoach(null);
            }

            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/coaches/search?query=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => setFilteredCoaches(response.data))
                .catch(error => {
                    console.error('Error fetching coaches:', error);
                    alert('Failed to load coaches.');
                });
        } else {
            setFilteredCoaches([]);
            setSelectedCoach(null);
        }
    }, [searchQuery, selectedCoach]);

    useEffect(() => {
        if (teamSearchQuery) {
            if (selectedTeam && teamSearchQuery !== selectedTeam.name) {
                setSelectedTeam(null);
            }

            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/teams/search?query=${teamSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => setFilteredTeams(response.data))
                .catch(error => {
                    console.error('Error fetching teams:', error);
                    alert('Failed to load teams.');
                });
        } else {
            setFilteredTeams([]);
            setSelectedTeam(null);
        }
    }, [teamSearchQuery, selectedTeam]);

    const handleCoachSelect = (coach) => {
        setSelectedCoach(coach);
        setSearchQuery(`${coach.firstName} ${coach.lastName}`);
        setFilteredCoaches([]);
    };

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        setTeamSearchQuery(team.name);
        setFilteredTeams([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const contractData = {
            startDate,
            endDate,
            salary,
            transferFee,
            coachId: selectedCoach ? selectedCoach.id : null,
            teamId: selectedTeam ? selectedTeam.id : null,
        };

        axios.post('http://localhost:8080/api/coach-contracts/add', contractData, {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(() => {
                alert('Coach contract added successfully');
                resetForm();
            })
            .catch(error => console.error('Error adding contract:', error));
    };

    const resetForm = () => {
        setStartDate('');
        setEndDate('');
        setSalary('');
        setTransferFee('');
        setSearchQuery('');
        setFilteredCoaches([]);
        setSelectedCoach(null);
        setTeamSearchQuery('');
        setFilteredTeams([]);
        setSelectedTeam(null);
        setError(null);
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Coach Contract</h1>

            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <Form.Group controlId="formCoachSearch" className="mb-3">
                    <Form.Label>Search Coach</Form.Label>
                    <Form.Control
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a coach"
                    />
                    {filteredCoaches.length > 0 && !selectedCoach && (
                        <ListGroup className="mt-2">
                            {filteredCoaches.map((coach) => (
                                <ListGroup.Item
                                    key={coach.id}
                                    onClick={() => handleCoachSelect(coach)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {coach.firstName} {coach.lastName} ({coach.nickname})
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group controlId="formTeamSearch" className="mb-3">
                    <Form.Label>Search Team</Form.Label>
                    <Form.Control
                        type="text"
                        value={teamSearchQuery}
                        onChange={(e) => setTeamSearchQuery(e.target.value)}
                        placeholder="Search for a team"
                    />
                    {filteredTeams.length > 0 && !selectedTeam && (
                        <ListGroup className="mt-2">
                            {filteredTeams.map((team) => (
                                <ListGroup.Item
                                    key={team.id}
                                    onClick={() => handleTeamSelect(team)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {team.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group controlId="formStartDate" className="mb-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        max={getTodayDate()}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEndDate" className="mb-3">
                    <Form.Label>End Date (optional)</Form.Label>
                    <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                    />
                </Form.Group>

                <Form.Group controlId="formSalary" className="mb-3">
                    <Form.Label>Salary</Form.Label>
                    <Form.Control
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        min="0"
                    />
                </Form.Group>

                <Form.Group controlId="formTransferFee" className="mb-3">
                    <Form.Label>Transfer Fee</Form.Label>
                    <Form.Control
                        type="number"
                        value={transferFee}
                        onChange={(e) => setTransferFee(e.target.value)}
                        min="0"
                    />
                </Form.Group>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <Button variant="primary" type="submit" className="w-100">
                    Add Contract
                </Button>
            </Form>

            <Accordion className="mt-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>File Format Templates</Accordion.Header>
                    <Accordion.Body className="text-start">
                        <h5>JSON Template</h5>
                        <pre>
                {`[
    {
        "coachId": 1,
        "teamId": 1,
        "start_date": "2005-05-13",
        "end_date": "2005-08-13",
        "salary": 50000.00,
        "transferFee": 10000.00
    },
    {
        "coachId": 2,
        "teamId": 3,
        "start_date": "2009-05-13",
        "end_date": "2009-08-13",
        "salary": 60000.00,
        "transferFee": 12000.00
    }
]`}
            </pre>
                        <h5>CSV Template</h5>
                        <pre>
                {`startDate,endDate,salary,transferFee,coachId,teamId,isActive
1,1,2009-05-13,2009-08-13,50000.00,10000.00
2,3,2005-05-13,2005-08-13,60000.00,12000.00`}
            </pre>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default AddCoachContractForm;
