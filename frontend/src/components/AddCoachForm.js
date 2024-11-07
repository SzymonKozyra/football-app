import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Form, Button, Container, Row, Col, ToggleButtonGroup, ToggleButton, Accordion} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddCoachForm = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [nickname, setNickname] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');
    const [manualEntry, setManualEntry] = useState(true);

    // Set age limit to 25+
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear() - 25;
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        axios.get('http://localhost:8080/api/countries')
            .then(response => setCountries(response.data))
            .catch(error => console.error("Error fetching countries:", error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        if (manualEntry) {
            const coachData = {
                firstName: firstName,
                lastName: lastName,
                dateOfBirth: dateOfBirth,
                nickname: nickname,
                country: { name: selectedCountry }
            };

            axios.post('http://localhost:8080/api/coaches/add', coachData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Coach added successfully');
                    setFirstName('');
                    setLastName('');
                    setDateOfBirth('');
                    setNickname('');
                    setSelectedCountry('');
                })
                .catch(error => {
                    console.error('Error adding coach:', error);
                    alert('Failed to add coach');
                });
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/coaches/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Coaches imported successfully');
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing coaches:', error);
                    alert('Failed to import coaches');
                });
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Coach</h1>
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
                                value={firstName}
                                onChange={e => setFirstName(e.target.value)}
                                placeholder="Enter first name"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={e => setLastName(e.target.value)}
                                placeholder="Enter last name"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateOfBirth" className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                value={dateOfBirth}
                                onChange={e => setDateOfBirth(e.target.value)}
                                max={getTodayDate()}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNickname" className="mb-3">
                            <Form.Label>Nickname</Form.Label>
                            <Form.Control
                                type="text"
                                value={nickname}
                                onChange={e => setNickname(e.target.value)}
                                placeholder="Enter nickname"
                            />
                        </Form.Group>
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
                    </>
                ) : (
                    <>
                        <Form.Group controlId="formFileType" className="mb-3">
                            <Form.Label>File Type</Form.Label>
                            <Form.Select
                                value={fileType}
                                onChange={(e) => setFileType(e.target.value)}
                                required
                            >
                                <option value="">Select file type</option>
                                <option value="json">JSON</option>
                                <option value="csv">CSV</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Import Coaches (CSV or JSON)</Form.Label>
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
                    {manualEntry ? 'Add Coach' : 'Import Coaches'}
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
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1980-05-15",
    "nickname": "The One",
    "countryName": "China"
  },
  {
    "firstName": "Kamil",
    "lastName": "Nowak",
    "dateOfBirth": "1950-12-14",
    "nickname": "",
    "countryName": "Poland"
  }
]`}
                        </pre>
                        <h5>CSV Template</h5>
                        <pre>
                            {`CityName,CountryName
AnotherCity,AnotherCountry`}
                        </pre>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default AddCoachForm;
