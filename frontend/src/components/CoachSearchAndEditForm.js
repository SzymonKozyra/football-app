import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import '../App.css';

const CoachSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [coaches, setCoaches] = useState([]);
    const [countries, setCountries] = useState([]); // List of countries
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        countryName: '' // Using countryName instead of countryId
    });

    useEffect(() => {
        // Fetch available countries from the backend
        axios.get('http://localhost:8080/api/countries')
            .then(response => {
                setCountries(response.data);
            })
            .catch(error => {
                console.error('Error fetching countries:', error);
            });
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        // Fetch coaches based on the search query
        axios.get(`http://localhost:8080/api/coaches/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }  // Add JWT token for authorization
        })
            .then(response => {
                setCoaches(response.data);
            })
            .catch(error => {
                console.error('Error fetching coaches:', error);
            });
    };

    const handleEditClick = (coach) => {
        setSelectedCoach(coach);
        setEditData({
            firstName: coach.firstName,
            lastName: coach.lastName,
            dateOfBirth: coach.dateOfBirth,
            nickname: coach.nickname,
            countryName: coach.country.name // Use country name for display
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        // Send updated coach data to the backend
        const updatedData = {
            ...editData,
            countryName: editData.countryName // Backend will find ID based on countryName
        };

        axios.put(`http://localhost:8080/api/coaches/${selectedCoach.id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }  // JWT token for authorization
        })
            .then(response => {
                alert('Coach updated successfully');
                setSelectedCoach(null); // Clear selected coach after update
            })
            .catch(error => {
                console.error('Error updating coach:', error);
                alert('Failed to update coach');
            });
    };

    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Search Coach</h1>
            <Form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
                <Form.Control
                    type="text"
                    placeholder="Enter first or last name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="me-2"
                    style={{ maxWidth: '400px' }}
                />
                <Button variant="primary" type="submit">Search</Button>
            </Form>

            {coaches.length > 0 && (
                <div>
                    <h3 className="text-center mb-3">Coaches found:</h3>
                    <Container>
                        {coaches.map(coach => (
                            <Card key={coach.id} className="mb-3 shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>ID:</strong> {coach.id}<br />
                                        <strong>Name:</strong> {coach.firstName} {coach.lastName} ({coach.nickname})<br />
                                        <strong>Country:</strong> {coach.country.name}
                                    </div>
                                    <Button variant="outline-primary" onClick={() => handleEditClick(coach)}>Edit</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </div>
            )}

            {selectedCoach && (
                <div className="mt-5">
                    <h3 className="text-center">Edit Coach: {selectedCoach.firstName} {selectedCoach.lastName}</h3>
                    <Form onSubmit={handleEditSubmit} className="p-4 border rounded shadow-sm bg-light">
                        <Form.Group controlId="formFirstName" className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.firstName}
                                onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.lastName}
                                onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDateOfBirth" className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                value={editData.dateOfBirth}
                                onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formNickname" className="mb-3">
                            <Form.Label>Nickname</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.nickname}
                                onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
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

export default CoachSearchAndEditForm;
