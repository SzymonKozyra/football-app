import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ToggleButtonGroup, ToggleButton, Accordion } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddRefereeForm = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [file, setFile] = useState(null);
    const [importMode, setImportMode] = useState(false);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear() - 25;
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        axios.get('http://localhost:8080/api/countries', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(response => setCountries(response.data))
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (!importMode) {
            const refereeData = {
                firstName,
                lastName,
                dateOfBirth,
                countryName: selectedCountry, // Używamy countryName zamiast countryId
            };

            axios.post('http://localhost:8080/api/referees/add', refereeData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Referee added successfully');
                    setFirstName('');
                    setLastName('');
                    setDateOfBirth('');
                    setSelectedCountry('');
                })
                .catch(error => {
                    console.error('Error adding referee:', error);
                    alert('Failed to add referee');
                });
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', file.type.includes('json') ? 'json' : 'csv');

            axios.post('http://localhost:8080/api/referees/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Referees imported successfully');
                    setFile(null);
                })
                .catch(error => {
                    console.error('Error importing referees:', error);
                    alert('Failed to import referees');
                });
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">{importMode ? 'Import Referees' : 'Add Referee'}</h1>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <Row className="mb-3 justify-content-center">
                    <Col xs="auto">
                        <ToggleButtonGroup
                            type="radio"
                            name="entryType"
                            defaultValue="manual"
                            onChange={(value) => setImportMode(value === 'import')}
                        >
                            <ToggleButton
                                id="manual-entry"
                                value="manual"
                                variant={!importMode ? 'primary' : 'outline-primary'}
                            >
                                Manual Entry
                            </ToggleButton>
                            <ToggleButton
                                id="import-file"
                                value="import"
                                variant={importMode ? 'primary' : 'outline-primary'}
                            >
                                Import from File
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Col>
                </Row>

                {!importMode ? (
                    <>
                        <Form.Group controlId="formFirstName" className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateOfBirth" className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                max={getTodayDate()}
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCountry" className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                required
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </>
                ) : (
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Import File</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".json,.csv"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </Form.Group>
                )}

                <Button variant="primary" type="submit" className="w-100 mt-3">
                    {importMode ? 'Import Referees' : 'Add Referee'}
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
        "first_name": "FirstName",
        "last_name": "LastName",
        "date_of_birth": "1975-08-12",
        "country_name": "CountryName"
    },
    {
        "first_name": "AnotherFirstName",
        "last_name": "AnotherLastName",
        "date_of_birth": "1969-05-23",
        "country_name": "CountryName"
    }
]`}
                        </pre>
                        <h5>CSV Template</h5>
                        <pre>
                            {`first_name,last_name,date_of_birth,country_name
FirstName1,LastName1,1975-08-12,CountryName1
FirstName2,LastName2,1969-05-23,CountryName2`}
                        </pre>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default AddRefereeForm;
