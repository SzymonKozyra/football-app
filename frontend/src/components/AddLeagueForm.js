import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ToggleButtonGroup, ToggleButton, Accordion, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddLeagueForm = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [leagueName, setLeagueName] = useState('');
    const [edition, setEdition] = useState('');
    const [fileType, setFileType] = useState('');
    const [file, setFile] = useState(null);
    const [manualEntry, setManualEntry] = useState(true); // Default to manual entry
    const [isEditionValid, setIsEditionValid] = useState(true);
    const [alertMessage, setAlertMessage] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:8080/api/countries')
            .then(response => setCountries(response.data))
            .catch(error => console.error("Error fetching countries:", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isEditionValid) {
            alert('Edition must be in format number/number, e.g. 23/24');
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        if (manualEntry) {
            const leagueData = {
                name: leagueName,
                countryName: selectedCountry,
                edition: edition
            };

            axios.post('http://localhost:8080/api/leagues/add', leagueData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('League added successfully');
                    setLeagueName('');
                    setSelectedCountry('');
                    setEdition('');
                })
                .catch(error => {
//                    console.error('Error adding league:', error);
//                    alert('Failed to add league');
                    if (error.response && error.response.data) {
                        setAlertMessage(error.response.data);
                    } else {
                        setAlertMessage('An error occurred while adding league');
                    }
                });
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/leagues/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    const { message, duplicates } = response.data;
                    alert(message);
                    if (duplicates && duplicates.length > 0) {
                        console.log("Skipped duplicate records at positions:", duplicates);
                    }
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing leagues:', error);
                    alert(error.response?.data || 'Failed to import leagues');
                });

        }
    };

    const handleEditionChange = (e) => {
        const value = e.target.value;
        setEdition(value);
        const editionPattern = /^\d{2}\/\d{2}$/;
        setIsEditionValid(editionPattern.test(value));
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add League</h1>
            {alertMessage && <Alert variant="danger" onClose={() => setAlertMessage(null)} dismissible>{alertMessage}</Alert>}
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
                        <Form.Group controlId="formCountry" className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                required
                            >
                                <option value="">Select a country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formLeagueName" className="mb-3">
                            <Form.Label>League Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={leagueName}
                                onChange={(e) => setLeagueName(e.target.value)}
                                placeholder="Enter league name"
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formEdition" className="mb-3">
                            <Form.Label>Edition (e.g., 23/24)</Form.Label>
                            <Form.Control
                                type="text"
                                value={edition}
                                onChange={handleEditionChange}
                                placeholder="Enter edition"
                                isInvalid={!isEditionValid}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Edycja musi być w formacie liczba/liczba, np. 23/24
                            </Form.Control.Feedback>
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
                            <Form.Label>Import Leagues (CSV or JSON)</Form.Label>
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
                    {manualEntry ? 'Add League' : 'Import Leagues'}
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
        "countryName": "England",
        "name": "Premier League",
        "edition": "23/24"
    },
    {
        "countryName": "Spain",
        "name": "La Liga",
        "edition": "21/22"
    }
]`}
                        </pre>
                        <h5>CSV Template</h5>
                        <pre>
                            {`countryName, name, edition
England, Premier League, 23/24
Spain, La Liga, 21/22`}
                        </pre>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default AddLeagueForm;