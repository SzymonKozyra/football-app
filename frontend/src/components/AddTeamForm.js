import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ToggleButtonGroup, ToggleButton, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddTeamForm = () => {
    const [teamName, setTeamName] = useState('');
    const [picture, setPicture] = useState('');
    const [isClub, setIsClub] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [leagueSearchQuery, setLeagueSearchQuery] = useState('');
    const [filteredLeagues, setFilteredLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [manualEntry, setManualEntry] = useState(true);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');

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
    }, [searchQuery, leagueSearchQuery]);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        setLeagueSearchQuery(league.name);
        setFilteredLeagues([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        if (manualEntry) {
            const teamData = {
                name: teamName,
                picture: picture,
                isClub: isClub,
                leagueId: selectedLeague ? selectedLeague.id : null
            };

            axios.post('http://localhost:8080/api/teams/add', teamData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Team added successfully');
                    setTeamName('');
                    setPicture('');
                    setSearchQuery('');
                    setSelectedLeague(null);
                    setLeagueSearchQuery('');
                })
                .catch(error => {
                    console.error('Error adding team:', error);
                    alert('Failed to add team');
                });
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/teams/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Teams imported successfully');
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing teams:', error);
                    alert('Failed to import teams');
                });
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Team</h1>
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
                        <Form.Group controlId="formTeamName" className="mb-3">
                            <Form.Label>Team Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                placeholder="Enter team name"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formPicture" className="mb-3">
                            <Form.Label>Picture</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter picture filename"
                                value={picture}
                                onChange={(e) => setPicture(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formIsClub" className="mb-3">
                            <Form.Label>Is Club?</Form.Label>
                            <Form.Select value={isClub} onChange={(e) => setIsClub(e.target.value === 'true')}>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formLeagueSearch" className="mb-3">
                            <Form.Label>Search League</Form.Label>
                            <Form.Control
                                type="text"
                                value={leagueSearchQuery}
                                onChange={(e) => setLeagueSearchQuery(e.target.value)}
                                placeholder="Search for a league"
                            />
                            {filteredLeagues.length > 0 && (
                                <ul>
                                    {filteredLeagues.map((league) => (
                                        <li key={league.id} onClick={() => handleLeagueSelect(league)}>
                                            {league.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </Form.Group>
                    </>
                ) : (
                    <>
                        <Form.Group controlId="formFileType" className="mb-3">
                            <Form.Label>File Type</Form.Label>
                            <Form.Select value={fileType} onChange={(e) => setFileType(e.target.value)} required>
                                <option value="">Select file type</option>
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Import Teams (CSV or JSON)</Form.Label>
                            <Form.Control
                                type="file"
                                accept=".csv,.json"
                                onChange={(e) => setFile(e.target.files[0])}
                                required
                            />
                        </Form.Group>
                    </>
                )}

                <Button variant="primary" type="submit" className="w-100 mt-3">
                    {manualEntry ? 'Add Team' : 'Import Teams'}
                </Button>
            </Form>

            {/* Template Section */}
            <Accordion className="mt-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>File Format Templates</Accordion.Header>
                    <Accordion.Body className="text-start">
                        <h5>JSON Template</h5>
                        <pre>
                            {`[
    {
        "name": "TeamName",
        "is_club": true,
        "picture": "pictureFileName",
        "value": "5000000",
        "league_id": 0
    },
    {
        "name": "AnotherTeam",
        "is_club": false,
        "picture": "anotherPictureFileName",
        "value": "3000000",
        "league_id": 1
    }
]`}
                        </pre>
                        <h5>CSV Template</h5>
                        <pre>
                            {`name,is_club,picture,value,league_id
TeamName1,true,pictureFileName,5000000,0,0
AnotherTeam,false,anotherPictureFileName,3000000,1,1`}
                        </pre>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default AddTeamForm;
