import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const MatchSearchAndEditForm = () => {
    const [matches, setMatches] = useState([]);
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [editData, setEditData] = useState({
        dateTime: '',
        referee: null,
        stadium: null,
        league: null,
        homeTeam: null,
        awayTeam: null,
        round: '',
        status: 'UPCOMING',
        homeGoals: 0,
        awayGoals: 0,
        homePossession: 0,
        awayPossession: 0,
        homePasses: 0,
        awayPasses: 0,
        homeAccuratePasses: 0,
        awayAccuratePasses: 0,
        homeShots: 0,
        awayShots: 0,
        homeShotsOnGoal: 0,
        awayShotsOnGoal: 0,
        homeCorners: 0,
        awayCorners: 0,
        homeOffside: 0,
        awayOffside: 0,
        homeFouls: 0,
        awayFouls: 0,
    });
    const [filteredReferees, setFilteredReferees] = useState([]);
    const [filteredStadiums, setFilteredStadiums] = useState([]);
    const [filteredLeagues, setFilteredLeagues] = useState([]);
    const [filteredHomeTeams, setFilteredHomeTeams] = useState([]);
    const [filteredAwayTeams, setFilteredAwayTeams] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [homeTeamSearchQuery, setHomeTeamSearchQuery] = useState('');
    const [awayTeamSearchQuery, setAwayTeamSearchQuery] = useState('');
    const [refereeSearchQuery, setRefereeSearchQuery] = useState('');
    const [stadiumSearchQuery, setStadiumSearchQuery] = useState('');
    const [leagueSearchQuery, setLeagueSearchQuery] = useState('');


    const token = localStorage.getItem('jwtToken');

    useEffect(() => {
        axios.get('http://localhost:8080/api/matches', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                const sortedMatches = response.data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
                setMatches(sortedMatches);
            })
            .catch(error => console.error('Error fetching matches:', error));
    }, []);

    const handleEditClick = (match) => {
        setSelectedMatch(match.id);
        setEditData({
            dateTime: match.dateTime,
            referee: match.referee ? match.referee.id : null,
            stadium: match.stadium ? match.stadium.id : null,
            league: match.league ? match.league.id : null,
            homeTeam: match.homeTeam ? match.homeTeam.id : null,
            awayTeam: match.awayTeam ? match.awayTeam.id : null,
            round: match.round,
            status: match.status,
            homeGoals: match.homeGoals || 0,
            awayGoals: match.awayGoals || 0,
            homePossession: match.homePossession || 0,
            awayPossession: match.awayPossession || 0,
            homePasses: match.homePasses || 0,
            awayPasses: match.awayPasses || 0,
            homeAccuratePasses: match.homeAccuratePasses || 0,
            awayAccuratePasses: match.awayAccuratePasses || 0,
            homeShots: match.homeShots || 0,
            awayShots: match.awayShots || 0,
            homeShotsOnGoal: match.homeShotsOnGoal || 0,
            awayShotsOnGoal: match.awayShotsOnGoal || 0,
            homeCorners: match.homeCorners || 0,
            awayCorners: match.awayCorners || 0,
            homeOffside: match.homeOffside || 0,
            awayOffside: match.awayOffside || 0,
            homeFouls: match.homeFouls || 0,
            awayFouls: match.awayFouls || 0,
        });
        setHomeTeamSearchQuery(match.homeTeam.name);
        setAwayTeamSearchQuery(match.awayTeam.name);
        setRefereeSearchQuery(`${match.referee.firstName} ${match.referee.lastName}`);
        setStadiumSearchQuery(match.stadium.name);
        setLeagueSearchQuery(match.league.name);

    };

    const handleEditSubmit = (e) => {
        e.preventDefault();

        const updatedMatch = {
            ...editData,
            referee: { id: editData.referee },
            stadium: { id: editData.stadium },
            league: { id: editData.league },
            homeTeam: { id: editData.homeTeam },
            awayTeam: { id: editData.awayTeam },
        };

        axios.put(`http://localhost:8080/api/matches/${selectedMatch}`, updatedMatch, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Match updated successfully');
                setSelectedMatch(null);
            })
            .catch(error => {
                console.error('Error updating match:', error);
                alert('Failed to update match');
            });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search and Edit Matches</h1>
            {matches.length > 0 ? (
                <div>
                    <h3 className="text-center mb-3">Matches:</h3>
                    <Container>
                        {matches.map(match => (
                            <React.Fragment key={match.id}>
                                <Card className="mb-3 shadow-sm">
                                    <Card.Body className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <strong>ID:</strong> {match.id}<br />
                                            <strong>Date:</strong> {new Date(match.dateTime).toLocaleString()}<br />
                                            <strong>Round:</strong> {match.round}<br />
                                            <strong>Status:</strong> {match.status}<br />
                                            <strong>Home Team:</strong> {match.homeTeam.name}<br />
                                            <strong>Away Team:</strong> {match.awayTeam.name}
                                        </div>
                                        <Button variant="outline-primary" onClick={() => handleEditClick(match)}>Edit</Button>
                                    </Card.Body>
                                </Card>

                                {selectedMatch === match.id && (
                                    <div className="p-4 border rounded shadow-sm bg-light mb-3">
                                        <h3 className="text-center mb-4">Edit Match</h3>
                                        <Form onSubmit={handleEditSubmit}>
                                            <Form.Group controlId="formMatchStatus" className="mb-3">
                                                <Form.Label>Match Status</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={editData.status}
                                                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                                                    required
                                                >
                                                    <option value="UPCOMING">UPCOMING</option>
                                                    <option value="IN_PLAY">IN_PLAY</option>
                                                    <option value="FINISHED">FINISHED</option>
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group controlId="formDateTime" className="mb-3">
                                                <Form.Label>Date and Time</Form.Label>
                                                <Form.Control
                                                    type="datetime-local"
                                                    value={editData.dateTime}
                                                    onChange={(e) => setEditData({ ...editData, dateTime: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formRound" className="mb-3">
                                                <Form.Label>Round</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    value={editData.round}
                                                    onChange={(e) => setEditData({ ...editData, round: e.target.value })}
                                                    required
                                                />
                                            </Form.Group>

                                            <Form.Group controlId="formHomeTeam" className="mb-3">
                                                <Form.Label>Home Team</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search for a home team"
                                                    value={homeTeamSearchQuery}
                                                    onChange={(e) => setHomeTeamSearchQuery(e.target.value)}
                                                    required
                                                />
                                                {filteredHomeTeams.length > 0 && (
                                                    <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                        {filteredHomeTeams.map((team) => (
                                                            <ListGroup.Item
                                                                key={team.id}
                                                                action
                                                                onClick={() => setEditData({ ...editData, homeTeam: team.id })}
                                                            >
                                                                {team.name}
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                )}
                                            </Form.Group>

                                            <Form.Group controlId="formAwayTeam" className="mb-3">
                                                <Form.Label>Away Team</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search for an away team"
                                                    value={awayTeamSearchQuery}
                                                    onChange={(e) => setAwayTeamSearchQuery(e.target.value)}
                                                    required
                                                />
                                                {filteredAwayTeams.length > 0 && (
                                                    <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                        {filteredAwayTeams.map((team) => (
                                                            <ListGroup.Item
                                                                key={team.id}
                                                                action
                                                                onClick={() => setEditData({ ...editData, awayTeam: team.id })}
                                                            >
                                                                {team.name}
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                )}
                                            </Form.Group>

                                            <Form.Group controlId="formReferee" className="mb-3">
                                                <Form.Label>Referee</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search for a referee"
                                                    value={refereeSearchQuery}
                                                    onChange={(e) => setRefereeSearchQuery(e.target.value)}
                                                    required
                                                />
                                                {filteredReferees.length > 0 && (
                                                    <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                        {filteredReferees.map((ref) => (
                                                            <ListGroup.Item
                                                                key={ref.id}
                                                                action
                                                                onClick={() => setEditData({ ...editData, referee: ref.id })}
                                                            >
                                                                {ref.firstName} {ref.lastName}
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                )}
                                            </Form.Group>

                                            <Form.Group controlId="formStadium" className="mb-3">
                                                <Form.Label>Stadium</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search for a stadium"
                                                    value={stadiumSearchQuery}
                                                    onChange={(e) => setStadiumSearchQuery(e.target.value)}
                                                    required
                                                />
                                                {filteredStadiums.length > 0 && (
                                                    <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                        {filteredStadiums.map((stad) => (
                                                            <ListGroup.Item
                                                                key={stad.id}
                                                                action
                                                                onClick={() => setEditData({ ...editData, stadium: stad.id })}
                                                            >
                                                                {stad.name}
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                )}
                                            </Form.Group>

                                            <Form.Group controlId="formLeague" className="mb-3">
                                                <Form.Label>League</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Search for a league"
                                                    value={leagueSearchQuery}
                                                    onChange={(e) => setLeagueSearchQuery(e.target.value)}
                                                />
                                                {filteredLeagues.length > 0 && (
                                                    <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                        {filteredLeagues.map((lg) => (
                                                            <ListGroup.Item
                                                                key={lg.id}
                                                                action
                                                                onClick={() => setEditData({ ...editData, league: lg.id })}
                                                            >
                                                                {lg.name}
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                )}
                                            </Form.Group>

                                            {editData.status !== 'UPCOMING' && (
                                                <>
                                                    <Row>
                                                        <Col>
                                                            <Form.Group controlId="formHomeGoals" className="mb-3">
                                                                <Form.Label>Home Team Goals</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.homeGoals}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, homeGoals: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    required
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <Form.Group controlId="formAwayGoals" className="mb-3">
                                                                <Form.Label>Away Team Goals</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.awayGoals}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, awayGoals: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    required
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <h5 className="text-center">Home</h5>
                                                            <Form.Group controlId="formHomePossession" className="mb-3">
                                                                <Form.Label>Home Possession (%)</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.homePossession}
                                                                    onChange={(e) => {
                                                                        const newHomePossession = parseFloat(e.target.value);
                                                                        setEditData({
                                                                            ...editData,
                                                                            homePossession: newHomePossession,
                                                                            awayPossession: 100 - newHomePossession,
                                                                        });
                                                                    }}
                                                                    min="0"
                                                                    max="100"
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="formHomePasses" className="mb-3">
                                                                <Form.Label>Home Passes</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.homePasses}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, homePasses: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="formHomeAccuratePasses" className="mb-3">
                                                                <Form.Label>Home Accurate Passes</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.homeAccuratePasses}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, homeAccuratePasses: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    max={editData.homePasses}
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="formHomeShots" className="mb-3">
                                                                <Form.Label>Home Shots</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.homeShots}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, homeShots: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="formHomeShotsOnGoal" className="mb-3">
                                                                <Form.Label>Home Shots on Goal</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.homeShotsOnGoal}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, homeShotsOnGoal: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    max={editData.homeShots}
                                                                    required
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col>
                                                            <h5 className="text-center">Away</h5>
                                                            <Form.Group controlId="formAwayPossession" className="mb-3">
                                                                <Form.Label>Away Possession (%)</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.awayPossession}
                                                                    onChange={(e) => {
                                                                        const newAwayPossession = parseFloat(e.target.value);
                                                                        setEditData({
                                                                            ...editData,
                                                                            awayPossession: newAwayPossession,
                                                                            homePossession: 100 - newAwayPossession,
                                                                        });
                                                                    }}
                                                                    min="0"
                                                                    max="100"
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="formAwayPasses" className="mb-3">
                                                                <Form.Label>Away Passes</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.awayPasses}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, awayPasses: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="formAwayAccuratePasses" className="mb-3">
                                                                <Form.Label>Away Accurate Passes</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.awayAccuratePasses}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, awayAccuratePasses: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    max={editData.awayPasses}
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="formAwayShots" className="mb-3">
                                                                <Form.Label>Away Shots</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.awayShots}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, awayShots: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    required
                                                                />
                                                            </Form.Group>
                                                            <Form.Group controlId="formAwayShotsOnGoal" className="mb-3">
                                                                <Form.Label>Away Shots on Goal</Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    value={editData.awayShotsOnGoal}
                                                                    onChange={(e) =>
                                                                        setEditData({ ...editData, awayShotsOnGoal: parseInt(e.target.value) })
                                                                    }
                                                                    min="0"
                                                                    max={editData.awayShots}
                                                                    required
                                                                />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </>
                                            )}

                                            <Button variant="primary" type="submit" className="w-100">
                                                Save Changes
                                            </Button>
                                        </Form>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </Container>
                </div>
            ) : (
                <p className="text-center">No matches found.</p>
            )}
        </Container>
    );
};

export default MatchSearchAndEditForm;
