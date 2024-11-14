//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container, Row, Col } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
//
//const AddMatchForm = () => {
//    const [dateTime, setDateTime] = useState('');
//    const [referee, setReferee] = useState('');
//    const [stadium, setStadium] = useState('');
//    const [league, setLeague] = useState('');
//    const [round, setRound] = useState(0);
//    const [homePossession, setHomePossession] = useState(0);
//    const [awayPossession, setAwayPossession] = useState(0);
//    const [homePasses, setHomePasses] = useState(0);
//    const [awayPasses, setAwayPasses] = useState(0);
//    const [homeAccuratePasses, setHomeAccuratePasses] = useState(0);
//    const [awayAccuratePasses, setAwayAccuratePasses] = useState(0);
//    const [homeShots, setHomeShots] = useState(0);
//    const [awayShots, setAwayShots] = useState(0);
//    const [homeShotsOnGoal, setHomeShotsOnGoal] = useState(0);
//    const [awayShotsOnGoal, setAwayShotsOnGoal] = useState(0);
//    const [homeCorners, setHomeCorners] = useState(0);
//    const [awayCorners, setAwayCorners] = useState(0);
//    const [homeOffside, setHomeOffside] = useState(0);
//    const [awayOffside, setAwayOffside] = useState(0);
//    const [homeFouls, setHomeFouls] = useState(0);
//    const [awayFouls, setAwayFouls] = useState(0);
//
//    const [referees, setReferees] = useState([]);
//    const [stadiums, setStadiums] = useState([]);
//    const [leagues, setLeagues] = useState([]);
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        axios.get('http://localhost:8080/api/referees', {
//            headers: { Authorization: `Bearer ${token}` }
//        }).then(response => setReferees(response.data));
//
//        axios.get('http://localhost:8080/api/stadiums', {
//            headers: { Authorization: `Bearer ${token}` }
//        }).then(response => setStadiums(response.data));
//
//        axios.get('http://localhost:8080/api/leagues', {
//            headers: { Authorization: `Bearer ${token}` }
//        }).then(response => setLeagues(response.data));
//    }, []);
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const matchData = {
//            dateTime,
//            referee: { id: referee },
//            stadium: { id: stadium },
//            league: { id: league },
//            round,
//            homePossession,
//            awayPossession,
//            homePasses,
//            awayPasses,
//            homeAccuratePasses,
//            awayAccuratePasses,
//            homeShots,
//            awayShots,
//            homeShotsOnGoal,
//            awayShotsOnGoal,
//            homeCorners,
//            awayCorners,
//            homeOffside,
//            awayOffside,
//            homeFouls,
//            awayFouls
//        };
//
//        axios.post('http://localhost:8080/api/matches/add', matchData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            alert('Match added successfully');
//            setDateTime('');
//            setReferee('');
//            setStadium('');
//            setLeague('');
//            setRound(0);
//            setHomePossession(0);
//            setAwayPossession(0);
//            setHomePasses(0);
//            setAwayPasses(0);
//            setHomeAccuratePasses(0);
//            setAwayAccuratePasses(0);
//            setHomeShots(0);
//            setAwayShots(0);
//            setHomeShotsOnGoal(0);
//            setAwayShotsOnGoal(0);
//            setHomeCorners(0);
//            setAwayCorners(0);
//            setHomeOffside(0);
//            setAwayOffside(0);
//            setHomeFouls(0);
//            setAwayFouls(0);
//        })
//        .catch(error => {
//            console.error('Error adding match:', error);
//            alert('Failed to add match');
//        });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Add Match</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//                <Form.Group controlId="formDateTime" className="mb-3">
//                    <Form.Label>Date and Time</Form.Label>
//                    <Form.Control
//                        type="datetime-local"
//                        value={dateTime}
//                        onChange={(e) => setDateTime(e.target.value)}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formReferee" className="mb-3">
//                    <Form.Label>Referee</Form.Label>
//                    <Form.Select
//                        value={referee}
//                        onChange={(e) => setReferee(e.target.value)}
//                        required
//                    >
//                        <option value="">Select a referee</option>
//                        {referees.map(ref => (
//                            <option key={ref.id} value={ref.id}>{ref.name}</option>
//                        ))}
//                    </Form.Select>
//                </Form.Group>
//
//                <Form.Group controlId="formStadium" className="mb-3">
//                    <Form.Label>Stadium</Form.Label>
//                    <Form.Select
//                        value={stadium}
//                        onChange={(e) => setStadium(e.target.value)}
//                        required
//                    >
//                        <option value="">Select a stadium</option>
//                        {stadiums.map(stad => (
//                            <option key={stad.id} value={stad.id}>{stad.name}</option>
//                        ))}
//                    </Form.Select>
//                </Form.Group>
//
//                <Form.Group controlId="formLeague" className="mb-3">
//                    <Form.Label>League</Form.Label>
//                    <Form.Select
//                        value={league}
//                        onChange={(e) => setLeague(e.target.value)}
//                        required
//                    >
//                        <option value="">Select a league</option>
//                        {leagues.map(lg => (
//                            <option key={lg.id} value={lg.id}>{lg.name}</option>
//                        ))}
//                    </Form.Select>
//                </Form.Group>
//
//                <Form.Group controlId="formRound" className="mb-3">
//                    <Form.Label>Round</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={round}
//                        onChange={(e) => setRound(parseInt(e.target.value))}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formHomePossession" className="mb-3">
//                    <Form.Label>Home Possession (%)</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homePossession}
//                        onChange={(e) => setHomePossession(parseFloat(e.target.value))}
//                    />
//                </Form.Group>
//
//                {/* Additional form groups for other match statistics (homePasses, awayPasses, etc.) */}
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">Add Match</Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddMatchForm;






//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
//
//const AddMatchForm = () => {
//    const [dateTime, setDateTime] = useState('');
//    const [referee, setReferee] = useState('');
//    const [stadium, setStadium] = useState('');
//    const [league, setLeague] = useState('');
//    const [round, setRound] = useState(0);
//    const [homePossession, setHomePossession] = useState(0);
//    const [awayPossession, setAwayPossession] = useState(0);
//    const [homePasses, setHomePasses] = useState(0);
//    const [awayPasses, setAwayPasses] = useState(0);
//    const [homeAccuratePasses, setHomeAccuratePasses] = useState(0);
//    const [awayAccuratePasses, setAwayAccuratePasses] = useState(0);
//    const [homeShots, setHomeShots] = useState(0);
//    const [awayShots, setAwayShots] = useState(0);
//    const [homeShotsOnGoal, setHomeShotsOnGoal] = useState(0);
//    const [awayShotsOnGoal, setAwayShotsOnGoal] = useState(0);
//    const [homeCorners, setHomeCorners] = useState(0);
//    const [awayCorners, setAwayCorners] = useState(0);
//    const [homeOffside, setHomeOffside] = useState(0);
//    const [awayOffside, setAwayOffside] = useState(0);
//    const [homeFouls, setHomeFouls] = useState(0);
//    const [awayFouls, setAwayFouls] = useState(0);
//
//    const [referees, setReferees] = useState([]);
//    const [stadiums, setStadiums] = useState([]);
//    const [leagues, setLeagues] = useState([]);
//
//    // Funkcja do pobierania lig
//    const fetchLeagues = () => {
//        const token = localStorage.getItem('jwtToken');
//        axios.get('http://localhost:8080/api/leagues/search', {
//            params: { query: '' },
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => setLeagues(response.data))
//        .catch(error => console.error('Error fetching leagues:', error));
//    };
//
//    // Funkcja do pobierania stadionów
//    const fetchStadiums = () => {
//        const token = localStorage.getItem('jwtToken');
//        axios.get('http://localhost:8080/api/stadiums/search', {
//            params: { query: '' },
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => setStadiums(response.data))
//        .catch(error => console.error('Error fetching stadiums:', error));
//    };
//
//    // Funkcja do pobierania sędziów
//    const fetchReferees = () => {
//        const token = localStorage.getItem('jwtToken');
//        axios.get('http://localhost:8080/api/referees/search', {
//            params: { query: '' },
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => setReferees(response.data))
//        .catch(error => console.error('Error fetching referees:', error));
//    };
//
//    useEffect(() => {
//        fetchReferees();
//        fetchStadiums();
//        fetchLeagues();
//    }, []);
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const matchData = {
//            dateTime,
//            referee: { id: referee },
//            stadium: { id: stadium },
//            league: { id: league },
//            round,
//            homePossession,
//            awayPossession,
//            homePasses,
//            awayPasses,
//            homeAccuratePasses,
//            awayAccuratePasses,
//            homeShots,
//            awayShots,
//            homeShotsOnGoal,
//            awayShotsOnGoal,
//            homeCorners,
//            awayCorners,
//            homeOffside,
//            awayOffside,
//            homeFouls,
//            awayFouls
//        };
//
//        axios.post('http://localhost:8080/api/matches/add', matchData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            alert('Match added successfully');
//            setDateTime('');
//            setReferee('');
//            setStadium('');
//            setLeague('');
//            setRound(0);
//            setHomePossession(0);
//            setAwayPossession(0);
//            setHomePasses(0);
//            setAwayPasses(0);
//            setHomeAccuratePasses(0);
//            setAwayAccuratePasses(0);
//            setHomeShots(0);
//            setAwayShots(0);
//            setHomeShotsOnGoal(0);
//            setAwayShotsOnGoal(0);
//            setHomeCorners(0);
//            setAwayCorners(0);
//            setHomeOffside(0);
//            setAwayOffside(0);
//            setHomeFouls(0);
//            setAwayFouls(0);
//        })
//        .catch(error => {
//            console.error('Error adding match:', error);
//            alert('Failed to add match');
//        });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Add Match</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//                <Form.Group controlId="formDateTime" className="mb-3">
//                    <Form.Label>Date and Time</Form.Label>
//                    <Form.Control
//                        type="datetime-local"
//                        value={dateTime}
//                        onChange={(e) => setDateTime(e.target.value)}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formReferee" className="mb-3">
//                    <Form.Label>Referee</Form.Label>
//                    <Form.Select
//                        value={referee}
//                        onChange={(e) => setReferee(e.target.value)}
//                        required
//                    >
//                        <option value="">Select a referee</option>
//                        {referees.map(ref => (
//                            <option key={ref.id} value={ref.id}>{ref.name}</option>
//                        ))}
//                    </Form.Select>
//                </Form.Group>
//
//                <Form.Group controlId="formStadium" className="mb-3">
//                    <Form.Label>Stadium</Form.Label>
//                    <Form.Select
//                        value={stadium}
//                        onChange={(e) => setStadium(e.target.value)}
//                        required
//                    >
//                        <option value="">Select a stadium</option>
//                        {stadiums.map(stad => (
//                            <option key={stad.id} value={stad.id}>{stad.name}</option>
//                        ))}
//                    </Form.Select>
//                </Form.Group>
//
//                <Form.Group controlId="formLeague" className="mb-3">
//                    <Form.Label>League</Form.Label>
//                    <Form.Select
//                        value={league}
//                        onChange={(e) => setLeague(e.target.value)}
//                        required
//                    >
//                        <option value="">Select a league</option>
//                        {leagues.map(lg => (
//                            <option key={lg.id} value={lg.id}>{lg.name}</option>
//                        ))}
//                    </Form.Select>
//                </Form.Group>
//
//                <Form.Group controlId="formRound" className="mb-3">
//                    <Form.Label>Round</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={round}
//                        onChange={(e) => setRound(parseInt(e.target.value))}
//                        required
//                    />
//                </Form.Group>
//
//                {/* Additional form groups for other match statistics */}
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">Add Match</Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddMatchForm;





//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container, ListGroup } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
//
//const AddMatchForm = () => {
//    const [dateTime, setDateTime] = useState('');
//    const [referee, setReferee] = useState('');
//    const [stadium, setStadium] = useState('');
//    const [league, setLeague] = useState('');
//    const [round, setRound] = useState(0);
//    const [homePossession, setHomePossession] = useState(0);
//    const [awayPossession, setAwayPossession] = useState(0);
//
//    const [referees, setReferees] = useState([]);
//    const [stadiums, setStadiums] = useState([]);
//    const [leagues, setLeagues] = useState([]);
//
//    const [filteredReferees, setFilteredReferees] = useState([]);
//    const [filteredStadiums, setFilteredStadiums] = useState([]);
//    const [filteredLeagues, setFilteredLeagues] = useState([]);
//
//    const [refereeQuery, setRefereeQuery] = useState('');
//    const [stadiumQuery, setStadiumQuery] = useState('');
//    const [leagueQuery, setLeagueQuery] = useState('');
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        axios.get('http://localhost:8080/api/referees/search', {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            setReferees(response.data);
//            setFilteredReferees(response.data); // Wyświetl pełną listę na początku
//        })
//        .catch(error => console.error('Error fetching referees:', error));
//
//        axios.get('http://localhost:8080/api/stadiums/search', {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            setStadiums(response.data);
//            setFilteredStadiums(response.data); // Wyświetl pełną listę na początku
//        })
//        .catch(error => console.error('Error fetching stadiums:', error));
//
//        axios.get('http://localhost:8080/api/leagues/search', {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            setLeagues(response.data);
//            setFilteredLeagues(response.data); // Wyświetl pełną listę na początku
//        })
//        .catch(error => console.error('Error fetching leagues:', error));
//    }, []);
//
//    // Filtrowanie listy sędziów
//    useEffect(() => {
//        const results = referees.filter(ref =>
//            ref && ref.name && ref.name.toLowerCase().includes(refereeQuery.toLowerCase())
//        );
//        setFilteredReferees(results);
//    }, [refereeQuery, referees]);
//
//    // Filtrowanie listy stadionów
//    useEffect(() => {
//        const results = stadiums.filter(stad =>
//            stad && stad.name && stad.name.toLowerCase().includes(stadiumQuery.toLowerCase())
//        );
//        setFilteredStadiums(results);
//    }, [stadiumQuery, stadiums]);
//
//    // Filtrowanie listy lig
//    useEffect(() => {
//        const results = leagues.filter(lg =>
//            lg && lg.name && lg.name.toLowerCase().includes(leagueQuery.toLowerCase())
//        );
//        setFilteredLeagues(results);
//    }, [leagueQuery, leagues]);
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const matchData = {
//            dateTime,
//            referee: { id: referee },
//            stadium: { id: stadium },
//            league: { id: league },
//            round,
//            homePossession,
//            awayPossession
//        };
//
//        axios.post('http://localhost:8080/api/matches/add', matchData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            alert('Match added successfully');
//        })
//        .catch(error => {
//            console.error('Error adding match:', error);
//            alert('Failed to add match');
//        });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Add Match</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//                {/* Wyszukiwanie i wybór sędziego */}
//                <Form.Group controlId="formRefereeQuery" className="mb-3">
//                    <Form.Label>Referee</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search for a referee"
//                        value={refereeQuery}
//                        onChange={(e) => setRefereeQuery(e.target.value)}
//                    />
//                    <ListGroup>
//                        {filteredReferees.map((ref) =>
//                            ref && ref.name && (
//                                <ListGroup.Item
//                                    key={ref.id}
//                                    action
//                                    active={ref.id === referee}
//                                    onClick={() => setReferee(ref.id)}
//                                >
//                                    {ref.name}
//                                </ListGroup.Item>
//                            )
//                        )}
//                    </ListGroup>
//                </Form.Group>
//
//                {/* Wyszukiwanie i wybór stadionu */}
//                <Form.Group controlId="formStadiumQuery" className="mb-3">
//                    <Form.Label>Stadium</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search for a stadium"
//                        value={stadiumQuery}
//                        onChange={(e) => setStadiumQuery(e.target.value)}
//                    />
//                    <ListGroup>
//                        {filteredStadiums.map((stad) =>
//                            stad && stad.name && (
//                                <ListGroup.Item
//                                    key={stad.id}
//                                    action
//                                    active={stad.id === stadium}
//                                    onClick={() => setStadium(stad.id)}
//                                >
//                                    {stad.name}
//                                </ListGroup.Item>
//                            )
//                        )}
//                    </ListGroup>
//                </Form.Group>
//
//                {/* Wyszukiwanie i wybór ligi */}
//                <Form.Group controlId="formLeagueQuery" className="mb-3">
//                    <Form.Label>League</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search for a league"
//                        value={leagueQuery}
//                        onChange={(e) => setLeagueQuery(e.target.value)}
//                    />
//                    <ListGroup>
//                        {filteredLeagues.map((lg) =>
//                            lg && lg.name && (
//                                <ListGroup.Item
//                                    key={lg.id}
//                                    action
//                                    active={lg.id === league}
//                                    onClick={() => setLeague(lg.id)}
//                                >
//                                    {lg.name}
//                                </ListGroup.Item>
//                            )
//                        )}
//                    </ListGroup>
//                </Form.Group>
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">Add Match</Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddMatchForm;





//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import { Form, Button, Container, ListGroup } from 'react-bootstrap';
//import 'bootstrap/dist/css/bootstrap.min.css';
//
//const AddMatchForm = () => {
//    const [dateTime, setDateTime] = useState('');
//    const [refereeSearchQuery, setRefereeSearchQuery] = useState('');
//    const [stadiumSearchQuery, setStadiumSearchQuery] = useState('');
//    const [leagueSearchQuery, setLeagueSearchQuery] = useState('');
//    const [filteredReferees, setFilteredReferees] = useState([]);
//    const [filteredStadiums, setFilteredStadiums] = useState([]);
//    const [filteredLeagues, setFilteredLeagues] = useState([]);
//    const [selectedReferee, setSelectedReferee] = useState(null);
//    const [selectedStadium, setSelectedStadium] = useState(null);
//    const [selectedLeague, setSelectedLeague] = useState(null);
//
//    // Dodanie brakujących zmiennych stanu
//    const [round, setRound] = useState(0);
//    const [homePossession, setHomePossession] = useState(0);
//    const [awayPossession, setAwayPossession] = useState(0);
//    const [homePasses, setHomePasses] = useState(0);
//    const [awayPasses, setAwayPasses] = useState(0);
//    const [homeAccuratePasses, setHomeAccuratePasses] = useState(0);
//    const [awayAccuratePasses, setAwayAccuratePasses] = useState(0);
//    const [homeShots, setHomeShots] = useState(0);
//    const [awayShots, setAwayShots] = useState(0);
//    const [homeShotsOnGoal, setHomeShotsOnGoal] = useState(0);
//    const [awayShotsOnGoal, setAwayShotsOnGoal] = useState(0);
//    const [homeCorners, setHomeCorners] = useState(0);
//    const [awayCorners, setAwayCorners] = useState(0);
//    const [homeOffside, setHomeOffside] = useState(0);
//    const [awayOffside, setAwayOffside] = useState(0);
//    const [homeFouls, setHomeFouls] = useState(0);
//    const [awayFouls, setAwayFouls] = useState(0);
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        if (leagueSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => setFilteredLeagues(response.data))
//            .catch(error => console.error('Error fetching leagues:', error));
//        } else {
//            setFilteredLeagues([]);
//        }
//
//        if (refereeSearchQuery && token) {
//            console.log("Searching referees with query:", refereeSearchQuery);  // Logowanie przed wysłaniem żądania
//            axios.get(`http://localhost:8080/api/referees/search?query=${refereeSearchQuery}`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => {
//                console.log("Referees found:", response.data);  // Logowanie wyników z API
//                setFilteredReferees(response.data);
//            })
//            .catch(error => console.error('Error fetching referees:', error));
//        } else {
//            setFilteredReferees([]);
//        }
//
//        if (stadiumSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/stadiums/search?query=${stadiumSearchQuery}`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => setFilteredStadiums(response.data))
//            .catch(error => console.error('Error fetching stadiums:', error));
//        } else {
//            setFilteredStadiums([]);
//        }
//    }, [leagueSearchQuery, refereeSearchQuery, stadiumSearchQuery]);
//
//    const handleLeagueSelect = (league) => {
//        setSelectedLeague(league);
//        setLeagueSearchQuery(league.name);
//        setFilteredLeagues([]);
//    };
//
//    const handleRefereeSelect = (referee) => {
//        setSelectedReferee(referee);
//        //setRefereeSearchQuery(referee.name);
//        setRefereeSearchQuery(`${referee.firstName} ${referee.lastName}`);
//        setFilteredReferees([]);
//    };
//
//    const handleStadiumSelect = (stadium) => {
//        setSelectedStadium(stadium);
//        setStadiumSearchQuery(stadium.name);
//        setFilteredStadiums([]);
//    };
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const matchData = {
//            dateTime,
//            referee: { id: selectedReferee.id },
//            stadium: { id: selectedStadium.id },
//            league: { id: selectedLeague.id },
//            round,
//            homePossession,
//            awayPossession,
//            homePasses,
//            awayPasses,
//            homeAccuratePasses,
//            awayAccuratePasses,
//            homeShots,
//            awayShots,
//            homeShotsOnGoal,
//            awayShotsOnGoal,
//            homeCorners,
//            awayCorners,
//            homeOffside,
//            awayOffside,
//            homeFouls,
//            awayFouls
//        };
//
//        axios.post('http://localhost:8080/api/matches/add', matchData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            alert('Match added successfully');
//            // Resetowanie stanu formularza
//            setDateTime('');
//            setSelectedReferee(null);
//            setSelectedStadium(null);
//            setSelectedLeague(null);
//            setLeagueSearchQuery('');
//            setRefereeSearchQuery('');
//            setStadiumSearchQuery('');
//            setRound(0);
//            setHomePossession(0);
//            setAwayPossession(0);
//            setHomePasses(0);
//            setAwayPasses(0);
//            setHomeAccuratePasses(0);
//            setAwayAccuratePasses(0);
//            setHomeShots(0);
//            setAwayShots(0);
//            setHomeShotsOnGoal(0);
//            setAwayShotsOnGoal(0);
//            setHomeCorners(0);
//            setAwayCorners(0);
//            setHomeOffside(0);
//            setAwayOffside(0);
//            setHomeFouls(0);
//            setAwayFouls(0);
//        })
//        .catch(error => {
//            console.error('Error adding match:', error);
//            alert('Failed to add match');
//        });
//    };
//
//    return (
//        <Container className="mt-5">
//            <h1 className="text-center mb-4">Add Match</h1>
//            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
//
//                <Form.Group controlId="formDateTime" className="mb-3">
//                    <Form.Label>Date and Time</Form.Label>
//                    <Form.Control
//                        type="datetime-local"
//                        value={dateTime}
//                        onChange={(e) => setDateTime(e.target.value)}
//                        required
//                    />
//                </Form.Group>
//
//                {/* Wybór sędziego */}
//                <Form.Group controlId="formReferee" className="mb-3">
//                    <Form.Label>Referee</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search for a referee"
//                        value={refereeSearchQuery}
//                        onChange={(e) => setRefereeSearchQuery(e.target.value)}
//                    />
//                    {filteredReferees.length > 0 && (
//                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                            {filteredReferees.map(ref => (
//                                <ListGroup.Item
//                                    key={ref.id}
//                                    action
//                                    onClick={() => handleRefereeSelect(ref)}
//                                >
//                                    {ref.firstName} {ref.lastName}
//                                </ListGroup.Item>
//                            ))}
//                        </ListGroup>
//                    )}
//                </Form.Group>
//
//                {/* Wybór stadionu */}
//                <Form.Group controlId="formStadium" className="mb-3">
//                    <Form.Label>Stadium</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search for a stadium"
//                        value={stadiumSearchQuery}
//                        onChange={(e) => setStadiumSearchQuery(e.target.value)}
//                    />
//                    {filteredStadiums.length > 0 && (
//                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                            {filteredStadiums.map(stad => (
//                                <ListGroup.Item
//                                    key={stad.id}
//                                    action
//                                    onClick={() => handleStadiumSelect(stad)}
//                                >
//                                    {stad.name}
//                                </ListGroup.Item>
//                            ))}
//                        </ListGroup>
//                    )}
//                </Form.Group>
//
//                {/* Wybór ligi */}
//                <Form.Group controlId="formLeague" className="mb-3">
//                    <Form.Label>League</Form.Label>
//                    <Form.Control
//                        type="text"
//                        placeholder="Search for a league"
//                        value={leagueSearchQuery}
//                        onChange={(e) => setLeagueSearchQuery(e.target.value)}
//                    />
//                    {filteredLeagues.length > 0 && (
//                        <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
//                            {filteredLeagues.map(lg => (
//                                <ListGroup.Item
//                                    key={lg.id}
//                                    action
//                                    onClick={() => handleLeagueSelect(lg)}
//                                >
//                                    {lg.name}
//                                </ListGroup.Item>
//                            ))}
//                        </ListGroup>
//                    )}
//                </Form.Group>
//
//                <Form.Group controlId="formRound" className="mb-3">
//                    <Form.Label>Round</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={round}
//                        onChange={(e) => setRound(parseInt(e.target.value))}
//                        required
//                    />
//                </Form.Group>
//                <Row>
//                    <Col>
//                    </Col>
//                </Row>
//
//                <Form.Group controlId="formHomePossession" className="mb-3">
//                    <Form.Label>Home Possession (%)</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homePossession}
//                        onChange={(e) => {
//                            const newHomePossession = parseFloat(e.target.value);
//                            setHomePossession(newHomePossession);
//                            setAwayPossession(100 - newHomePossession);
//                        }}
//                        min='0'
//                        max='100'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formAwayPossession" className="mb-3">
//                    <Form.Label>Away Possession (%)</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={100-homePossession}
//                        onChange={(e) => {
//                            const newAwayPossession = parseFloat(e.target.value);
//                            setAwayPossession(newAwayPossession);
//                            setHomePossession(100 - newAwayPossession);
//                        }}
//                        min='0'
//                        max='100'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formHomePasses" className="mb-3">
//                    <Form.Label>Home Passes</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homePasses}
//                        onChange={(e) => setHomePasses(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formAwayPasses" className="mb-3">
//                    <Form.Label>Away Passes</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={awayPasses}
//                        onChange={(e) => setAwayPasses(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formHomeAccuratePasses" className="mb-3">
//                    <Form.Label>Home Accurate Passes</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homeAccuratePasses}
//                        onChange={(e) => setHomeAccuratePasses(parseInt(e.target.value))}
//                        min='0'
//                        max={homePasses}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formAwayAccuratePasses" className="mb-3">
//                    <Form.Label>Away Accurate Passes</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={awayAccuratePasses}
//                        onChange={(e) => setAwayAccuratePasses(parseInt(e.target.value))}
//                        min='0'
//                        max={awayPasses}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formHomeShots" className="mb-3">
//                    <Form.Label>Home Shots</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homeShots}
//                        onChange={(e) => setHomeShots(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formAwayShots" className="mb-3">
//                    <Form.Label>Away Shots</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={awayShots}
//                        onChange={(e) => setAwayShots(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formHomeShotsOnGoal" className="mb-3">
//                    <Form.Label>Home Shots on Goal</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homeShotsOnGoal}
//                        onChange={(e) => setHomeShotsOnGoal(parseInt(e.target.value))}
//                        min='0'
//                        max={homeShots}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formAwayShotsOnGoal" className="mb-3">
//                    <Form.Label>Away Shots on Goal</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={awayShotsOnGoal}
//                        onChange={(e) => setAwayShotsOnGoal(parseInt(e.target.value))}
//                        min='0'
//                        max={awayShots}
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formHomeCorners" className="mb-3">
//                    <Form.Label>Home Corners</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homeCorners}
//                        onChange={(e) => setHomeCorners(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formAwayCorners" className="mb-3">
//                    <Form.Label>Away Corners</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={awayCorners}
//                        onChange={(e) => setAwayCorners(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formHomeOffside" className="mb-3">
//                    <Form.Label>Home Offside</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homeOffside}
//                        onChange={(e) => setHomeOffside(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formAwayOffside" className="mb-3">
//                    <Form.Label>Away Offside</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={awayOffside}
//                        onChange={(e) => setAwayOffside(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formHomeFouls" className="mb-3">
//                    <Form.Label>Home Fouls</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={homeFouls}
//                        onChange={(e) => setHomeFouls(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//                <Form.Group controlId="formAwayFouls" className="mb-3">
//                    <Form.Label>Away Fouls</Form.Label>
//                    <Form.Control
//                        type="number"
//                        value={awayFouls}
//                        onChange={(e) => setAwayFouls(parseInt(e.target.value))}
//                        min='0'
//                        required
//                    />
//                </Form.Group>
//
//
//                <Button variant="primary" type="submit" className="w-100 mt-3">Add Match</Button>
//            </Form>
//        </Container>
//    );
//};
//
//export default AddMatchForm;




//  KOLUMNY HOME I AWAY, TROCHE BRAKUJE
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ListGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddMatchForm = () => {
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

        if (leagueSearchQuery && token) {
            axios.get(`http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredLeagues(response.data))
            .catch(error => console.error('Error fetching leagues:', error));
        } else {
            setFilteredLeagues([]);
        }

        if (refereeSearchQuery && token) {
            console.log("Searching referees with query:", refereeSearchQuery);  // Logowanie przed wysłaniem żądania
            axios.get(`http://localhost:8080/api/referees/search?query=${refereeSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => {
                console.log("Referees found:", response.data);  // Logowanie wyników z API
                setFilteredReferees(response.data);
            })
            .catch(error => console.error('Error fetching referees:', error));
        } else {
            setFilteredReferees([]);
        }

        if (stadiumSearchQuery && token) {
            axios.get(`http://localhost:8080/api/stadiums/search?query=${stadiumSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredStadiums(response.data))
            .catch(error => console.error('Error fetching stadiums:', error));
        } else {
            setFilteredStadiums([]);
        }
    }, [leagueSearchQuery, refereeSearchQuery, stadiumSearchQuery]);

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

        axios.post('http://localhost:8080/api/matches/add', matchData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Match added successfully');
            // Resetowanie stanu formularza
            setDateTime('');
            setSelectedReferee(null);
            setSelectedStadium(null);
            setSelectedLeague(null);
            setLeagueSearchQuery('');
            setRefereeSearchQuery('');
            setStadiumSearchQuery('');
            setRound(0);
            setHomePossession(0);
            setAwayPossession(0);
            setHomePasses(0);
            setAwayPasses(0);
            setHomeAccuratePasses(0);
            setAwayAccuratePasses(0);
            setHomeShots(0);
            setAwayShots(0);
            setHomeShotsOnGoal(0);
            setAwayShotsOnGoal(0);
            setHomeCorners(0);
            setAwayCorners(0);
            setHomeOffside(0);
            setAwayOffside(0);
            setHomeFouls(0);
            setAwayFouls(0);
        })
        .catch(error => {
            console.error('Error adding match:', error);
            alert('Failed to add match');
        });
    };


    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Match</h1>
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

                <Button variant="primary" type="submit" className="w-100 mt-3">Add Match</Button>
            </Form>
        </Container>
    );
};

export default AddMatchForm;