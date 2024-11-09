import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ToggleButtonGroup, ToggleButton, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddPlayerForm = () => {
    const [manualEntry, setManualEntry] = useState(true);
    const [playerData, setPlayerData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        picture: '',
        positionId: '',
        countryId: '',
//        clubId: '',
//        nationalTeamId: '',
        value: ''
    });

    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
//    const [clubSearchQuery, setClubSearchQuery] = useState('');
//    const [nationalTeamSearchQuery, setNationalTeamSearchQuery] = useState('');
//    const [filteredClubs, setFilteredClubs] = useState([]);
//    const [filteredNationalTeams, setFilteredNationalTeams] = useState([]);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState("csv");

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear() - 15;
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/api/positions', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setPositions(res.data))
            .catch(error => console.error('Error fetching positions:', error));

        axios.get('http://localhost:8080/api/countries')
            .then(res => setCountries(res.data));
    }, []);

//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        if (clubSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/teams/search?query=${clubSearchQuery}&isClub=true`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//                .then(response => setFilteredClubs(response.data))
//                .catch(error => console.error('Error fetching clubs:', error));
//        } else {
//            setFilteredClubs([]);
//        }
//
//        if (nationalTeamSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/teams/search?query=${nationalTeamSearchQuery}&isClub=false`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//                .then(response => setFilteredNationalTeams(response.data))
//                .catch(error => console.error('Error fetching national teams:', error));
//        } else {
//            setFilteredNationalTeams([]);
//        }
//    }, [clubSearchQuery, nationalTeamSearchQuery]);

//    const handleClubSelect = (club) => {
//        setPlayerData({ ...playerData, clubId: club.id });
//        setClubSearchQuery(club.name);
//        setFilteredClubs([]);
//    };

//    const handleNationalTeamSelect = (nationalTeam) => {
//        setPlayerData({ ...playerData, nationalTeamId: nationalTeam.id });
//        setNationalTeamSearchQuery(nationalTeam.name);
//        setFilteredNationalTeams([]);
//    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (manualEntry) {
            axios.post('http://localhost:8080/api/players/add', playerData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => alert('Player added successfully'))
                .catch(err => alert('Failed to add player'));
        } else {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", fileType);

            axios.post('http://localhost:8080/api/players/import', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => alert("Players imported successfully"))
                .catch(error => {
                    console.error("Error importing players:", error);
                    alert("Failed to import players");
                });
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Player</h1>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <Row className="mb-3 justify-content-center">
                    <Col xs="auto">
                        <ToggleButtonGroup
                            type="radio"
                            name="entryType"
                            defaultValue="manual"
                            onChange={(value) => setManualEntry(value === 'manual')}
                        >
                            <ToggleButton
                                id="manual-entry"
                                value="manual"
                                variant={manualEntry ? 'primary' : 'outline-primary'}
                            >
                                Manual Entry
                            </ToggleButton>
                            <ToggleButton
                                id="import-file"
                                value="import"
                                variant={!manualEntry ? 'primary' : 'outline-primary'}
                            >
                                Import from File
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>

                {manualEntry ? (
                    <>
                        <Form.Group controlId="formFirstName" className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={playerData.firstName}
                                onChange={e => setPlayerData({ ...playerData, firstName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={playerData.lastName}
                                onChange={e => setPlayerData({ ...playerData, lastName: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateOfBirth" className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                max={getTodayDate()}
                                value={playerData.dateOfBirth}
                                onChange={e => setPlayerData({ ...playerData, dateOfBirth: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNickname" className="mb-3">
                            <Form.Label>Nickname</Form.Label>
                            <Form.Control
                                type="text"
                                value={playerData.nickname}
                                onChange={e => setPlayerData({ ...playerData, nickname: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPicture" className="mb-3">
                            <Form.Label>Picture</Form.Label>
                            <Form.Control
                                type="text"
                                value={playerData.picture}
                                onChange={e => setPlayerData({ ...playerData, picture: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPosition" className="mb-3">
                            <Form.Label>Position</Form.Label>
                            <Form.Select
                                value={playerData.positionId}
                                onChange={e => setPlayerData({ ...playerData, positionId: e.target.value })}
                                required
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
                                value={playerData.countryId}
                                onChange={e => setPlayerData({ ...playerData, countryId: e.target.value })}
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>
                                        {country.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formClubSearch" className="mb-3">
                            <Form.Label>Search Club</Form.Label>
                            <Form.Control
                                type="text"
                                value={clubSearchQuery}
                                onChange={e => setClubSearchQuery(e.target.value)}
                                placeholder="Search for a club"
                            />
                            {filteredClubs.length > 0 && (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {filteredClubs.map((club) => (
                                        <li key={club.id} onClick={() => handleClubSelect(club)} style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}>
                                            {club.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Group>
                        <Form.Group controlId="formNationalTeamSearch" className="mb-3">
                            <Form.Label>Search National Team</Form.Label>
                            <Form.Control
                                type="text"
                                value={nationalTeamSearchQuery}
                                onChange={e => setNationalTeamSearchQuery(e.target.value)}
                                placeholder="Search for a national team"
                            />
                            {filteredNationalTeams.length > 0 && (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {filteredNationalTeams.map((nationalTeam) => (
                                        <li key={nationalTeam.id} onClick={() => handleNationalTeamSelect(nationalTeam)} style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}>
                                            {nationalTeam.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Group>
                        <Form.Group controlId="formValue" className="mb-3">
                            <Form.Label>Value</Form.Label>
                            <Form.Control
                                type="number"
                                min="0"
                                value={playerData.value}
                                onChange={e => setPlayerData({ ...playerData, value: e.target.value })}
                            />
                        </Form.Group>
                    </>
                ) : (
                    <>
                        <Form.Group controlId="formFileType" className="mb-3">
                            <Form.Label>File Type</Form.Label>
                            <Form.Select value={fileType} onChange={e => setFileType(e.target.value)} required>
                                <option value="csv">CSV</option>
                                <option value="json">JSON</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Import Players (CSV or JSON)</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".csv,.json"
                                onChange={e => setFile(e.target.files[0])}
                                required
                            />
                        </Form.Group>
                    </>
                )}

                <Button variant="primary" type="submit" className="w-100 mt-3">
                    {manualEntry ? 'Add Player' : 'Import Players'}
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
        "first_name": "John",
        "last_name": "Doe",
        "date_of_birth": "1990-01-01",
        "nickname": "Johnny",
        "picture": "john_doe.png",
        "value": "5000000",
        "club_id": "1",
        "country_id": "1",
        "national_team_id": "1",
        "position_id": "2"
    }
]`}
                        </pre>
                        <h5>CSV Template</h5>
                        <pre>
                            {`first_name,last_name,date_of_birth,nickname,picture,value,club_id,country_id,national_team_id,position_id
John,Doe,1990-01-01,Johnny,john_doe.png,5000000,1,1,1,2`}
                        </pre>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default AddPlayerForm;
