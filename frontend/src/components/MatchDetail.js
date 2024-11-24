import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap'; // Dodaj ten import

const BASE_URL = 'http://localhost:8080';

const MatchDetail = ({ matchId, onBack }) => {
    const [matchDetails, setMatchDetails] = useState(null);

    useEffect(() => {
        axios.get(`${BASE_URL}/api/matches/${matchId}`)
            .then(response => setMatchDetails(response.data))
            .catch(error => console.error('Error fetching match details:', error));
    }, [matchId]);

    if (!matchDetails) {
        return <p>Loading match details...</p>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Button variant="secondary" onClick={onBack} style={{ marginBottom: '20px' }}>
                Back to Matches
            </Button>
            <h2>{`${matchDetails.homeTeam.name} vs ${matchDetails.awayTeam.name}`}</h2>
            <p>Date: {new Date(matchDetails.dateTime).toLocaleString()}</p>
            <p>Status: {matchDetails.status}</p>
            <p>Score: {matchDetails.homeGoals} - {matchDetails.awayGoals}</p>
        </div>
    );
};

export default MatchDetail;
