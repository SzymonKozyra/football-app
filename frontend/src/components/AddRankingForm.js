import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, ListGroup } from 'react-bootstrap';

const AddRankingForm = () => {
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const rankingData = {
            name: name,
            startDate: startDate,
            endDate: endDate,
        };

         axios.post('http://localhost:8080/api/rankings/add', rankingData, {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(() => {
            alert('Ranking addes successfully!');
            setName('');
            setStartDate('');
            setEndDate('');
        })
        .catch((error) => console.error('Error adding ranking:', error));
    };

    return (
        <div className="container mt-4">
            <h2>Dodaj Ranking</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nazwa</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Data rozpoczęcia</label>
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Data zakończenia</label>
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                    Dodaj Ranking
                </button>
            </form>
            {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
    );
};

export default AddRankingForm;
