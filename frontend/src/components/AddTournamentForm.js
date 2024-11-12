import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AddTournamentForm = () => {
    const [tournamentName, setTournamentName] = useState('');
    const [edition, setEdition] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const tournamentData = {
            name: tournamentName,
            edition: edition
        };

        axios.post('http://localhost:8080/api/tournaments/add', tournamentData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Tournament added successfully');
            setTournamentName('');
            setEdition('');
        })
        .catch(error => {
            console.error('Error adding tournament:', error);
            alert('Failed to add tournament');
        });
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Tournament</h1>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <Form.Group controlId="formTournamentName" className="mb-3">
                    <Form.Label>Tournament Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={tournamentName}
                        onChange={(e) => setTournamentName(e.target.value)}
                        placeholder="Enter tournament name"
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formEdition" className="mb-3">
                    <Form.Label>Edition (e.g., 23/24)</Form.Label>
                    <Form.Control
                        type="text"
                        value={edition}
                        onChange={(e) => setEdition(e.target.value)}
                        placeholder="Enter edition"
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">Add Tournament</Button>
            </Form>
        </Container>
    );
};

export default AddTournamentForm;
