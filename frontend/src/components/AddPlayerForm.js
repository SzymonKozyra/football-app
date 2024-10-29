import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddPlayerForm = () => {
    const [playerData, setPlayerData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        picture: '',
        positionId: '',
        countryId: '',
        clubId: '',
        nationalTeamId: '',
        value: '' // Add value field

    });

    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [teams, setTeams] = useState([]);
    const [isClub, setIsClub] = useState(false);

    useEffect(() => {
        // Fetch data for select options
        axios.get('http://localhost:8080/api/positions', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(res => setPositions(res.data))
            .catch(error => console.error('Error fetching positions:', error));

        axios.get('http://localhost:8080/api/countries')
            .then(res => setCountries(res.data));

        axios.get('http://localhost:8080/api/teams', {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(res => setTeams(res.data))
            .catch(error => console.error('Error fetching teams:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(playerData);
        axios.post('http://localhost:8080/api/players/add', playerData, {
            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
        })
            .then(res => alert('Player added successfully'))
            .catch(err => alert('Failed to add player'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input type="text" value={playerData.firstName} onChange={e => setPlayerData({ ...playerData, firstName: e.target.value })} />

            <label>Last Name</label>
            <input type="text" value={playerData.lastName} onChange={e => setPlayerData({ ...playerData, lastName: e.target.value })} />

            <label>Date of Birth</label>
            <input type="date" value={playerData.dateOfBirth} onChange={e => setPlayerData({ ...playerData, dateOfBirth: e.target.value })} />

            <label>Nickname</label>
            <input type="text" value={playerData.nickname} onChange={e => setPlayerData({ ...playerData, nickname: e.target.value })} />

            <label>Picture</label>
            <input type="text" value={playerData.picture} onChange={e => setPlayerData({ ...playerData, picture: e.target.value })} />

            <label>Position</label>
            <select value={playerData.positionId} onChange={e => setPlayerData({ ...playerData, positionId: e.target.value })}>
                {positions.map(position => <option key={position.id} value={position.id}>{position.abbreviation}</option>)}
            </select>

            <label>Country</label>
            <select value={playerData.countryId} onChange={e => setPlayerData({ ...playerData, countryId: e.target.value })}>
                {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
            </select>

            <label>Club ID</label>
            <input
                type="number"
                value={playerData.clubId}
                onChange={e => setPlayerData({ ...playerData, clubId: e.target.value })}
            />

            <label>National Team ID</label>
            <input
                type="number"
                value={playerData.nationalTeamId}
                onChange={e => setPlayerData({ ...playerData, nationalTeamId: e.target.value })}
            />

            <label>Value</label>
            <input type="number" value={playerData.value} onChange={e => setPlayerData({ ...playerData, value: e.target.value })} />


            <button type="submit">Add Player</button>
        </form>
    );
};

export default AddPlayerForm;
