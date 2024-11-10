import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const StadiumSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [stadiums, setStadiums] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState(null);
    const [editData, setEditData] = useState({
        name: '',
        capacity: '',
        cityName: '',
        countryName: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8080/api/countries', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(response => setCountries(response.data))
            .catch(error => console.error('Error fetching countries:', error));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/api/stadiums/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => setStadiums(response.data))
            .catch(error => console.error('Error fetching stadiums:', error));
    };

    const handleEditClick = (stadium) => {
        setSelectedStadium(stadium);
        setEditData({
            name: stadium.name,
            capacity: stadium.capacity,
            cityName: stadium.city.name,
            countryName: stadium.city.country.name
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const selectedCountry = countries.find(country => country.name === editData.countryName);
        const countryId = selectedCountry ? selectedCountry.id : null;

        const updatedData = {
            ...editData,
            countryId
        };

        axios.put(`http://localhost:8080/api/stadiums/${selectedStadium.id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('Stadium updated successfully');
                setSelectedStadium(null);
            })
            .catch(error => {
                console.error('Error updating stadium:', error);
                alert('Failed to update stadium');
            });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search Stadium</h1>
            <Form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
                <Form.Control
                    type="text"
                    placeholder="Enter stadium name or city"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="me-2"
                    style={{ maxWidth: '400px' }}
                />
                <Button variant="primary" type="submit">Search</Button>
            </Form>

            {stadiums.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-center mb-3">Stadiums found:</h3>
                    <Container>
                        {stadiums.map(stadium => (
                            <Card key={stadium.id} className="mb-3 shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center" style={{ textAlign: 'left' }}>
                                    <div>
                                        <strong>ID:</strong> {stadium.id}<br />
                                        <strong>Name:</strong> {stadium.name}<br />
                                        <strong>Capacity:</strong> {stadium.capacity}<br />
                                        <strong>City:</strong> {stadium.city.name}<br />
                                        <strong>Country:</strong> {stadium.city.country.name}
                                    </div>
                                    <Button variant="outline-primary" onClick={() => handleEditClick(stadium)}>Edit</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </div>
            )}

            {selectedStadium && (
                <div className="p-4 border rounded shadow-sm bg-light">
                    <h3 className="text-center mb-4">Edit Stadium: {selectedStadium.name}</h3>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formStadiumName" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCapacity" className="mb-3">
                            <Form.Label>Capacity</Form.Label>
                            <Form.Control
                                type="number"
                                value={editData.capacity}
                                onChange={(e) => setEditData({ ...editData, capacity: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCityName" className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.cityName}
                                onChange={(e) => setEditData({ ...editData, cityName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCountry" className="mb-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Select
                                value={editData.countryName}
                                onChange={(e) => setEditData({ ...editData, countryName: e.target.value })}
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.name}>
                                        {country.name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default StadiumSearchAndEditForm;
