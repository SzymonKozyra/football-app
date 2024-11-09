import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import '../App.css';

const LeagueSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [leagues, setLeagues] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [editData, setEditData] = useState({
        name: '',
        countryName: ''
    });

    useEffect(() => {
        axios.get('http://localhost:8080/api/countries', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
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

        axios.get(`http://localhost:8080/api/leagues/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setLeagues(response.data);
            })
            .catch(error => {
                console.error('Error fetching leagues:', error);
            });
    };

    const handleEditClick = (league) => {
        setSelectedLeague(league);
        setEditData({
            name: league.name,
            countryName: league.country.name
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

        axios.put(`http://localhost:8080/api/leagues/${selectedLeague.id}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('League updated successfully');
                setSelectedLeague(null);
            })
            .catch(error => {
                console.error('Error updating league:', error);
                alert('Failed to update league');
            });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search League</h1>
            <Form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
                <Form.Control
                    type="text"
                    placeholder="Enter league name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="me-2"
                    style={{ maxWidth: '400px' }}
                />
                <Button variant="primary" type="submit">Search</Button>
            </Form>

            {leagues.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-center mb-3">Leagues found:</h3>
                    <Container>
                        {leagues.map(league => (
                            <Card key={league.id} className="mb-3 shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>ID:</strong> {league.id}<br />
                                        <strong>Name:</strong> {league.name}<br />
                                        <strong>Country:</strong> {league.country.name}
                                    </div>
                                    <Button variant="outline-primary" onClick={() => handleEditClick(league)}>Edit</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </div>
            )}

            {selectedLeague && (
                <div className="p-4 border rounded shadow-sm bg-light">
                    <h3 className="text-center mb-4">Edit League: {selectedLeague.name}</h3>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formLeagueName" className="mb-3">
                            <Form.Label>League Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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

export default LeagueSearchAndEditForm;
