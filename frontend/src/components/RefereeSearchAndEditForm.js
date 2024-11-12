import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const RefereeSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [referees, setReferees] = useState([]);
    const [countries, setCountries] = useState([]);
    const [selectedReferee, setSelectedReferee] = useState(null);
    const [noResultsMessage, setNoResultsMessage] = useState('');
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
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

        axios.get(`http://localhost:8080/api/referees/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setReferees(response.data);
                setNoResultsMessage(response.data.length === 0 ? 'No results found.' : '');
            })
            .catch(error => console.error('Error fetching referees:', error));
    };

    const handleEditClick = (referee) => {
        setSelectedReferee(referee.id);
        setEditData({
            firstName: referee.firstName,
            lastName: referee.lastName,
            dateOfBirth: referee.dateOfBirth,
            countryName: referee.country.name
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const updatedData = {
            ...editData,
            countryName: editData.countryName
        };

        axios.put(`http://localhost:8080/api/referees/${selectedReferee}`, updatedData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Referee updated successfully');
                setSelectedReferee(null);
            })
            .catch(error => {
                console.error('Error updating referee:', error);
                alert('Failed to update referee');
            });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search Referee</h1>
            <Form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
                <Form.Control
                    type="text"
                    placeholder="Enter referee name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="me-2"
                    style={{ maxWidth: '400px' }}
                />
                <Button variant="primary" type="submit">Search</Button>
            </Form>

            {referees.length > 0 ? (
                <div className="mb-4">
                    <h3 className="text-center mb-3">Referees found:</h3>
                    <Container>
                        {referees.map(referee => (
                            <React.Fragment key={referee.id}>
                                <Card className="mb-3 shadow-sm">
                                    <Card.Body className="d-flex justify-content-between align-items-center" style={{ textAlign: 'left' }}>
                                        <div>
                                            <strong>ID:</strong> {referee.id}<br />
                                            <strong>Name:</strong> {referee.firstName} {referee.lastName}<br />
                                            <strong>Date of Birth:</strong> {referee.dateOfBirth}<br />
                                            <strong>Country:</strong> {referee.country.name}
                                        </div>
                                        <Button variant="outline-primary" onClick={() => handleEditClick(referee)}>Edit</Button>
                                    </Card.Body>
                                </Card>

                                {selectedReferee === referee.id && (
                                    <div className="p-4 border rounded shadow-sm bg-light mb-3">
                                        <h3 className="text-center mb-4">Edit Referee: {referee.firstName} {referee.lastName}</h3>
                                        <Form onSubmit={handleEditSubmit}>
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
                            </React.Fragment>
                        ))}
                    </Container>
                </div>
            ) : (
                <p className="text-center">{noResultsMessage}</p>
            )}
        </Container>
    );
};

export default RefereeSearchAndEditForm;
