import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col, ToggleButtonGroup, ToggleButton, Accordion } from 'react-bootstrap';
import '../App.css';

const AddStadiumForm = () => {
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [stadiumName, setStadiumName] = useState('');
    const [stadiumCapacity, setStadiumCapacity] = useState('');
    const [fileType, setFileType] = useState('');
    const [file, setFile] = useState(null);
    const [manualEntry, setManualEntry] = useState(true); // Default to manual entry

    useEffect(() => {
        axios.get('http://localhost:8080/api/countries')
            .then(response => setCountries(response.data))
            .catch(error => console.error("Error fetching countries:", error));
    }, []);

    const handleCountryChange = (e) => {
        const countryName = e.target.value;
        setSelectedCountry(countryName);

        axios.get(`http://localhost:8080/api/cities/by-country-name/${countryName}`)
            .then(response => setCities(response.data))
            .catch(error => console.error("Error fetching cities:", error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        if (manualEntry && stadiumCapacity <= 0) {
            alert('Stadium capacity must be greater than 0');
            return;
        }

        if (manualEntry) {
            const stadiumData = {
                name: stadiumName,
                capacity: stadiumCapacity,
                cityName: selectedCity,
                countryName: selectedCountry
            };

            axios.post('http://localhost:8080/api/stadiums/add', stadiumData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Stadium added successfully');
                    setStadiumName('');
                    setStadiumCapacity('');
                    setSelectedCountry('');
                    setSelectedCity('');
                })
                .catch(error => {
                    console.error('Error adding stadium:', error);
                    alert('Failed to add stadium');
                });
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/stadiums/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Stadiums imported successfully');
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing stadiums:', error);
                    alert('Failed to import stadiums');
                });
        }
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Stadium</h1>
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
                            <Form.Select value={selectedCountry} onChange={handleCountryChange} required>
                                <option value="">Select a country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group controlId="formCity" className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedCity}
                                onChange={(e) => setSelectedCity(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formStadiumName" className="mb-3">
                            <Form.Label>Stadium Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={stadiumName}
                                onChange={(e) => setStadiumName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formStadiumCapacity" className="mb-3">
                            <Form.Label>Stadium Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                value={stadiumCapacity}
                                onChange={(e) => setStadiumCapacity(e.target.value)}
                                required
                                min="1"
                            />
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
                            <Form.Label>Import Stadiums (CSV or JSON)</Form.Label>
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
                    {manualEntry ? 'Add Stadium' : 'Import Stadiums'}
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
        "name": "StadiumName",
        "capacity": 50000,
        "city_name": "CityName"
    },
    {
        "name": "AnotherStadium",
        "capacity": 30000,
        "city_name": "AnotherCityName"
    }
]`}
                        </pre>
                        <h5>CSV Template</h5>
                        <pre>
                            {`name,capacity,city_name
StadiumName1,50000,CityName1
AnotherStadium,30000,CityName2`}
                        </pre>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Container>
    );
};

export default AddStadiumForm;
