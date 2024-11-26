import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ListGroup, Accordion, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddMatchForm = () => {
    const navigate = useNavigate();

    const [dateTime, setDateTime] = useState('');
    const [refereeSearchQuery, setRefereeSearchQuery] = useState('');
    const [stadiumSearchQuery, setStadiumSearchQuery] = useState('');
    const [leagueSearchQuery, setLeagueSearchQuery] = useState('');
    const [filteredReferees, setFilteredReferees] = useState([]);
    const [filteredStadiums, setFilteredStadiums] = useState([]);
    const [filteredLeagues, setFilteredLeagues] = useState([]);
    const [selectedReferee, setSelectedReferee] = useState(null);
    const [selectedStadium, setSelectedStadium] = useState(null);
    const [selectedLeague, setSelectedLeague] = useState(null);

    const [round, setRound] = useState('');
    const [matchStatus, setMatchStatus] = useState('UPCOMING');
    const [homeTeamSearchQuery, setHomeTeamSearchQuery] = useState('');
    const [awayTeamSearchQuery, setAwayTeamSearchQuery] = useState('');
    const [filteredHomeTeams, setFilteredHomeTeams] = useState([]);
    const [filteredAwayTeams, setFilteredAwayTeams] = useState([]);

    const [selectedHomeTeam, setSelectedHomeTeam] = useState(null);
    const [selectedAwayTeam, setSelectedAwayTeam] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [newMatchId, setNewMatchId] = useState(null);

    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);
    const [teamError, setTeamError] = useState('');

    const resetForm = () => {
        setDateTime('');
        setRefereeSearchQuery('');
        setStadiumSearchQuery('');
        setLeagueSearchQuery('');
        setHomeTeamSearchQuery('');
        setAwayTeamSearchQuery('');
        setFilteredReferees([]);
        setFilteredStadiums([]);
        setFilteredLeagues([]);
        setFilteredHomeTeams([]);
        setFilteredAwayTeams([]);
        setSelectedReferee(null);
        setSelectedStadium(null);
        setSelectedLeague(null);
        setSelectedHomeTeam(null);
        setSelectedAwayTeam(null);
        setRound('');
        setMatchStatus('UPCOMING');
    };

    useEffect(() => {
        if (homeTeamSearchQuery) {
            if (selectedHomeTeam && homeTeamSearchQuery !== selectedHomeTeam.name) {
                setSelectedHomeTeam(null);
            }
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/teams/search?query=${homeTeamSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => setFilteredHomeTeams(response.data))
                .catch(error => console.error('Error fetching home teams:', error));
        } else {
            setFilteredHomeTeams([]);
        }
    }, [homeTeamSearchQuery, selectedHomeTeam]);

    useEffect(() => {
        if (awayTeamSearchQuery) {
            if (selectedAwayTeam && awayTeamSearchQuery !== selectedAwayTeam.name) {
                setSelectedAwayTeam(null);
            }
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/teams/search?query=${awayTeamSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => setFilteredAwayTeams(response.data))
                .catch(error => console.error('Error fetching away teams:', error));
        } else {
            setFilteredAwayTeams([]);
        }
    }, [awayTeamSearchQuery, selectedAwayTeam]);

    useEffect(() => {
        if (leagueSearchQuery) {
            if (selectedLeague && leagueSearchQuery !== selectedLeague.name) {
                setSelectedLeague(null);
            }
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => setFilteredLeagues(response.data))
                .catch(error => console.error('Error fetching leagues:', error));
        } else {
            setFilteredLeagues([]);
        }
    }, [leagueSearchQuery, selectedLeague]);

    useEffect(() => {
        if (refereeSearchQuery) {
            if (selectedReferee && refereeSearchQuery !== `${selectedReferee.firstName} ${selectedReferee.lastName}`) {
                setSelectedReferee(null);
            }
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/referees/search?query=${refereeSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => setFilteredReferees(response.data))
                .catch(error => console.error('Error fetching referees:', error));
        } else {
            setFilteredReferees([]);
        }
    }, [refereeSearchQuery, selectedReferee]);

    useEffect(() => {
        if (stadiumSearchQuery) {
            if (selectedStadium && stadiumSearchQuery !== selectedStadium.name) {
                setSelectedStadium(null);
            }
            const token = localStorage.getItem('jwtToken');
            axios.get(`http://localhost:8080/api/stadiums/search?query=${stadiumSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(response => setFilteredStadiums(response.data))
                .catch(error => console.error('Error fetching stadiums:', error));
        } else {
            setFilteredStadiums([]);
        }
    }, [stadiumSearchQuery, selectedStadium]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (selectedHomeTeam && selectedAwayTeam && selectedHomeTeam.id === selectedAwayTeam.id) {
            setTeamError('Home Team and Away Team cannot be the same.');
            return;
        } else {
            setTeamError('');
        }
        const token = localStorage.getItem('jwtToken');

        const matchData = {
            dateTime,
            referee: { id: selectedReferee?.id },
            stadium: { id: selectedStadium?.id },
            league: { id: selectedLeague?.id },
            homeTeam: { id: selectedHomeTeam?.id },
            awayTeam: { id: selectedAwayTeam?.id },
            round,
            duration: 90,
            status: matchStatus,
        };

        try {
            const response = await axios.post('http://localhost:8080/api/matches/add', matchData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.id) {
                setNewMatchId(response.data.id);
                handleModalShow();
                resetForm();
            } else {
                console.error('No match ID returned from backend.');
                alert('Failed to retrieve Match ID.');
            }
        } catch (error) {
            console.error('Error adding match:', error);
            alert('Failed to add match');
        }
    };

    const handleSelection = (setter, value, querySetter) => {
        setter(value);
        querySetter(value.name || `${value.firstName} ${value.lastName}`);
    };

    const handleAddMatchSquad = () => {
        console.log("New match ID before navigation:", newMatchId);
        handleModalClose();
        if (newMatchId) {
            navigate(`/add-match-squad/${newMatchId}`);
        } else {
            alert('Match ID is missing!');
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Match</h1>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <Form.Group className="mb-3">
                    <Form.Label>Match Status</Form.Label>
                    <Form.Control
                        as="select"
                        value={matchStatus}
                        onChange={(e) => setMatchStatus(e.target.value)}
                        required
                    >
                        <option value="UPCOMING">UPCOMING</option>
                        <option value="IN_PLAY">IN_PLAY</option>
                        <option value="FINISHED">FINISHED</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Round</Form.Label>
                    <Form.Control
                        type="text"
                        value={round}
                        onChange={(e) => setRound(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Home Team</Form.Label>
                    <Form.Control
                        type="text"
                        value={homeTeamSearchQuery}
                        onChange={(e) => setHomeTeamSearchQuery(e.target.value)}
                        placeholder="Search for a home team"
                    />
                    {filteredHomeTeams.length > 0 && !selectedHomeTeam && (
                        <ListGroup>
                            {filteredHomeTeams.map((team) => (
                                <ListGroup.Item
                                    key={team.id}
                                    action
                                    onClick={() => handleSelection(setSelectedHomeTeam, team, setHomeTeamSearchQuery)}
                                >
                                    {team.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Away Team</Form.Label>
                    <Form.Control
                        type="text"
                        value={awayTeamSearchQuery}
                        onChange={(e) => setAwayTeamSearchQuery(e.target.value)}
                        placeholder="Search for an away team"
                    />
                    {filteredAwayTeams.length > 0 && !selectedAwayTeam && (
                        <ListGroup>
                            {filteredAwayTeams.map((team) => (
                                <ListGroup.Item
                                    key={team.id}
                                    action
                                    onClick={() => handleSelection(setSelectedAwayTeam, team, setAwayTeamSearchQuery)}
                                >
                                    {team.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Referee</Form.Label>
                    <Form.Control
                        type="text"
                        value={refereeSearchQuery}
                        onChange={(e) => setRefereeSearchQuery(e.target.value)}
                        placeholder="Search for a referee"
                    />
                    {filteredReferees.length > 0 && !selectedReferee && (
                        <ListGroup>
                            {filteredReferees.map((ref) => (
                                <ListGroup.Item
                                    key={ref.id}
                                    action
                                    onClick={() => handleSelection(setSelectedReferee, ref, setRefereeSearchQuery)}
                                >
                                    {ref.firstName} {ref.lastName}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Stadium</Form.Label>
                    <Form.Control
                        type="text"
                        value={stadiumSearchQuery}
                        onChange={(e) => setStadiumSearchQuery(e.target.value)}
                        placeholder="Search for a stadium"
                    />
                    {filteredStadiums.length > 0 && !selectedStadium && (
                        <ListGroup>
                            {filteredStadiums.map((stad) => (
                                <ListGroup.Item
                                    key={stad.id}
                                    action
                                    onClick={() => handleSelection(setSelectedStadium, stad, setStadiumSearchQuery)}
                                >
                                    {stad.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>League</Form.Label>
                    <Form.Control
                        type="text"
                        value={leagueSearchQuery}
                        onChange={(e) => setLeagueSearchQuery(e.target.value)}
                        placeholder="Search for a league"
                    />
                    {filteredLeagues.length > 0 && !selectedLeague && (
                        <ListGroup>
                            {filteredLeagues.map((lg) => (
                                <ListGroup.Item
                                    key={lg.id}
                                    action
                                    onClick={() => handleSelection(setSelectedLeague, lg, setLeagueSearchQuery)}
                                >
                                    {lg.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                    Add Match
                </Button>
                {teamError && <p style={{ color: 'red', marginTop: '10px' }}>{teamError}</p>}
            </Form>

            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Match Added</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to add a squad for this match?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        No
                    </Button>
                    <Button variant="primary" onClick={handleAddMatchSquad}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>

            <Accordion className="mt-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>File Format Templates</Accordion.Header>
                    <Accordion.Body className="text-start">
                        <h5>JSON Template</h5>
                        <pre>
                {`[
    {
        "status": "UPCOMING",
        "date_time": "2023-11-25T15:00:00",
        "round": "1",
        "home_team_id": 4,
        "away_team_id": 5,
        "referee_id": 1,
        "stadium_id": 2,
        "league_id": 3
    },
    {
        "status": "FINISHED",
        "date_time": "2023-12-01T18:00:00",
        "round": "2",
        "home_team_id": 9,
        "away_team_id": 10,
        "referee_id": 6,
        "stadium_id": 7,
        "league_id": 8
    }
]`}
            </pre>
                        <h5>CSV Template</h5>
                        <pre>
                {`status,date_time,round,home_team_id,away_team_id,referee_id,stadium_id,league_id
UPCOMING,2023-11-25T15:00:00,1,4,5,1,2,3
FINISHED,2023-12-01T18:00:00,2,9,10,6,7,8`}
            </pre>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>

        </Container>
    );
};

export default AddMatchForm;
