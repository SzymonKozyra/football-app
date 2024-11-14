import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditMatchForm = ({ matchId }) => {
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

    const [round, setRound] = useState(0);
    const [homePossession, setHomePossession] = useState(0);
    const [awayPossession, setAwayPossession] = useState(0);
    const [homePasses, setHomePasses] = useState(0);
    const [awayPasses, setAwayPasses] = useState(0);
    const [homeAccuratePasses, setHomeAccuratePasses] = useState(0);
    const [awayAccuratePasses, setAwayAccuratePasses] = useState(0);
    const [homeShots, setHomeShots] = useState(0);
    const [awayShots, setAwayShots] = useState(0);
    const [homeShotsOnGoal, setHomeShotsOnGoal] = useState(0);
    const [awayShotsOnGoal, setAwayShotsOnGoal] = useState(0);
    const [homeCorners, setHomeCorners] = useState(0);
    const [awayCorners, setAwayCorners] = useState(0);
    const [homeOffside, setHomeOffside] = useState(0);
    const [awayOffside, setAwayOffside] = useState(0);
    const [homeFouls, setHomeFouls] = useState(0);
    const [awayFouls, setAwayFouls] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        // Pobierz dane meczu na podstawie matchId
        axios.get(`http://localhost:8080/api/matches/${matchId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const match = response.data;
            setDateTime(match.dateTime);
            setSelectedReferee(match.referee);
            setRefereeSearchQuery(`${match.referee.firstName} ${match.referee.lastName}`);
            setSelectedStadium(match.stadium);
            setStadiumSearchQuery(match.stadium.name);
            setSelectedLeague(match.league);
            setLeagueSearchQuery(match.league.name);
            setRound(match.round);
            setHomePossession(match.homePossession);
            setAwayPossession(match.awayPossession);
            setHomePasses(match.homePasses);
            setAwayPasses(match.awayPasses);
            setHomeAccuratePasses(match.homeAccuratePasses);
            setAwayAccuratePasses(match.awayAccuratePasses);
            setHomeShots(match.homeShots);
            setAwayShots(match.awayShots);
            setHomeShotsOnGoal(match.homeShotsOnGoal);
            setAwayShotsOnGoal(match.awayShotsOnGoal);
            setHomeCorners(match.homeCorners);
            setAwayCorners(match.awayCorners);
            setHomeOffside(match.homeOffside);
            setAwayOffside(match.awayOffside);
            setHomeFouls(match.homeFouls);
            setAwayFouls(match.awayFouls);
        })
        .catch(error => console.error('Error fetching match data:', error));

        // Pobieranie listy lig, sędziów i stadionów w razie potrzeby
        if (leagueSearchQuery && token) {
            axios.get(`http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => setFilteredLeagues(response.data))
            .catch(error => console.error('Error fetching leagues:', error));
        }

        if (refereeSearchQuery && token) {
            axios.get(`http://localhost:8080/api/referees/search?query=${refereeSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => setFilteredReferees(response.data))
            .catch(error => console.error('Error fetching referees:', error));
        }

        if (stadiumSearchQuery && token) {
            axios.get(`http://localhost:8080/api/stadiums/search?query=${stadiumSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(response => setFilteredStadiums(response.data))
            .catch(error => console.error('Error fetching stadiums:', error));
        }
    }, [matchId, leagueSearchQuery, refereeSearchQuery, stadiumSearchQuery]);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        setLeagueSearchQuery(league.name);
        setFilteredLeagues([]);
    };

    const handleRefereeSelect = (referee) => {
        setSelectedReferee(referee);
        //setRefereeSearchQuery(referee.name);
        setRefereeSearchQuery(`${referee.firstName} ${referee.lastName}`);
        setFilteredReferees([]);
    };

    const handleStadiumSelect = (stadium) => {
        setSelectedStadium(stadium);
        setStadiumSearchQuery(stadium.name);
        setFilteredStadiums([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const matchData = {
            dateTime,
            referee: { id: selectedReferee.id },
            stadium: { id: selectedStadium.id },
            league: { id: selectedLeague.id },
            round,
            homePossession,
            awayPossession,
            homePasses,
            awayPasses,
            homeAccuratePasses,
            awayAccuratePasses,
            homeShots,
            awayShots,
            homeShotsOnGoal,
            awayShotsOnGoal,
            homeCorners,
            awayCorners,
            homeOffside,
            awayOffside,
            homeFouls,
            awayFouls
        };

        axios.put(`http://localhost:8080/api/matches/${matchId}`, matchData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Match updated successfully');
        })
        .catch(error => {
            console.error('Error updating match:', error);
            alert('Failed to update match');
        });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Edit Match</h1>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <Form.Group controlId="formDateTime" className="mb-3">
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formReferee" className="mb-3">
                    <Form.Label>Referee</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search for a referee"
                        value={refereeSearchQuery}
                        onChange={(e) => setRefereeSearchQuery(e.target.value)}
                    />
                    {filteredReferees.length > 0 && (
                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredReferees.map(ref => (
                                <ListGroup.Item
                                    key={ref.id}
                                    action
                                    onClick={() => handleRefereeSelect(ref)}
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
                    />
                    {filteredStadiums.length > 0 && (
                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            {filteredStadiums.map(stad => (
                                <ListGroup.Item
                                    key={stad.id}
                                    action
                                    onClick={() => handleStadiumSelect(stad)}
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
                            {filteredLeagues.map(lg => (
                                <ListGroup.Item
                                    key={lg.id}
                                    action
                                    onClick={() => handleLeagueSelect(lg)}
                                >
                                    {lg.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Row>
                    <Col>
                        <h5 className="text-center">Home</h5>
                        <Form.Group controlId="formHomePossession" className="mb-3">
                            <Form.Label>Home Possession (%)</Form.Label>
                            <Form.Control
                                type="number"
                                value={homePossession}
                                onChange={(e) => {
                                    const newHomePossession = parseFloat(e.target.value);
                                    setHomePossession(newHomePossession);
                                    setAwayPossession(100 - newHomePossession);
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
                                value={homePasses}
                                onChange={(e) => setHomePasses(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formHomeAccuratePasses" className="mb-3">
                            <Form.Label>Home Accurate Passes</Form.Label>
                            <Form.Control
                                type="number"
                                value={homeAccuratePasses}
                                onChange={(e) => setHomeAccuratePasses(parseInt(e.target.value))}
                                min="0"
                                max={homePasses}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formHomeShots" className="mb-3">
                            <Form.Label>Home Shots</Form.Label>
                            <Form.Control
                                type="number"
                                value={homeShots}
                                onChange={(e) => setHomeShots(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formHomeShotsOnGoal" className="mb-3">
                            <Form.Label>Home Shots on Goal</Form.Label>
                            <Form.Control
                                type="number"
                                value={homeShotsOnGoal}
                                onChange={(e) => setHomeShotsOnGoal(parseInt(e.target.value))}
                                min="0"
                                max={homeShots}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formHomeCorners" className="mb-3">
                            <Form.Label>Home Corners</Form.Label>
                            <Form.Control
                                type="number"
                                value={homeCorners}
                                onChange={(e) => setHomeCorners(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formHomeOffside" className="mb-3">
                            <Form.Label>Home Offside</Form.Label>
                            <Form.Control
                                type="number"
                                value={homeOffside}
                                onChange={(e) => setHomeOffside(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formHomeFouls" className="mb-3">
                            <Form.Label>Home Fouls</Form.Label>
                            <Form.Control
                                type="number"
                                value={homeFouls}
                                onChange={(e) => setHomeFouls(parseInt(e.target.value))}
                                min="0"
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
                                value={awayPossession}
                                onChange={(e) => {
                                    const newAwayPossession = parseFloat(e.target.value);
                                    setAwayPossession(newAwayPossession);
                                    setHomePossession(100 - newAwayPossession);
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
                                value={awayPasses}
                                onChange={(e) => setAwayPasses(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAwayAccuratePasses" className="mb-3">
                            <Form.Label>Away Accurate Passes</Form.Label>
                            <Form.Control
                                type="number"
                                value={awayAccuratePasses}
                                onChange={(e) => setAwayAccuratePasses(parseInt(e.target.value))}
                                min="0"
                                max={awayPasses}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAwayShots" className="mb-3">
                            <Form.Label>Away Shots</Form.Label>
                            <Form.Control
                                type="number"
                                value={awayShots}
                                onChange={(e) => setAwayShots(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAwayShotsOnGoal" className="mb-3">
                            <Form.Label>Away Shots on Goal</Form.Label>
                            <Form.Control
                                type="number"
                                value={awayShotsOnGoal}
                                onChange={(e) => setAwayShotsOnGoal(parseInt(e.target.value))}
                                min="0"
                                max={awayShots}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAwayCorners" className="mb-3">
                            <Form.Label>Away Corners</Form.Label>
                            <Form.Control
                                type="number"
                                value={awayCorners}
                                onChange={(e) => setAwayCorners(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAwayOffside" className="mb-3">
                            <Form.Label>Away Offside</Form.Label>
                            <Form.Control
                                type="number"
                                value={awayOffside}
                                onChange={(e) => setAwayOffside(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAwayFouls" className="mb-3">
                            <Form.Label>Away Fouls</Form.Label>
                            <Form.Control
                                type="number"
                                value={awayFouls}
                                onChange={(e) => setAwayFouls(parseInt(e.target.value))}
                                min="0"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Button variant="primary" type="submit" className="w-100 mt-3">Update Match</Button>
            </Form>
        </Container>
    );
};

export default EditMatchForm;
