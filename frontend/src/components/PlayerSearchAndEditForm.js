import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const PlayerSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [players, setPlayers] = useState([]);
    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [teams, setTeams] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [editData, setEditData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        picture: '',
        positionId: '',
        countryId: '',
        clubId: '',
        nationalTeamId: '',
        value: ''
    });

    useEffect(() => {
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

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/api/players/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setPlayers(response.data);
            })
            .catch(error => {
                console.error('Error fetching players:', error);
            });
    };

    const handleEditClick = (player) => {
        setSelectedPlayer(player);
        setEditData({
            firstName: player.firstName,
            lastName: player.lastName,
            dateOfBirth: player.dateOfBirth,
            nickname: player.nickname,
            picture: player.picture,
            positionId: player.position.id,
            countryId: player.country.id,
            clubId: player.club ? player.club.id : '',
            nationalTeamId: player.nationalTeam ? player.nationalTeam.id : '',
            value: player.value
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.put(`http://localhost:8080/api/players/${selectedPlayer.id}`, editData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('Player updated successfully');
                setSelectedPlayer(null);
            })
            .catch(error => {
                console.error('Error updating player:', error);
                alert('Failed to update player');
            });
    };

    return (
        <div className="form-container">
            <h1>Search Player</h1>
            <form onSubmit={handleSearch} className="form-container">
                <input
                    type="text"
                    placeholder="Enter first or last name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field"
                />
                <button type="submit">Search</button>
            </form>

            {players.length > 0 && (
                <div>
                    <h3>Players found:</h3>
                    <ul className="player-list">
                        {players.map(player => (
                            <li key={player.id} className="list-item">
                                <strong>ID:</strong> {player.id} -
                                <strong> Name:</strong> {player.firstName} {player.lastName} -
                                <strong> Position:</strong> {player.position.abbreviation} -
                                <strong> Country:</strong> {player.country.name} -
                                <strong> Club:</strong> {player.club ? player.club.name : 'N/A'} -
                                <strong> National Team:</strong> {player.nationalTeam ? player.nationalTeam.name : 'N/A'} -
                                <strong> Nickname:</strong> {player.nickname ? player.nickname : 'N/A'} -
                                <strong> Picture:</strong> {player.picture} -
                                <strong> Value:</strong> ${player.value ? player.value.toFixed(2) : '0.00'} -
                                <strong> Date of Birth:</strong> {player.dateOfBirth}
                                <button onClick={() => handleEditClick(player)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedPlayer && (
                <div className="form-container">
                    <h3>Edit Player: {selectedPlayer.firstName} {selectedPlayer.lastName}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>First Name</label>
                            <input
                                type="text"
                                value={editData.firstName}
                                onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={editData.lastName}
                                onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Date of Birth</label>
                            <input
                                type="date"
                                value={editData.dateOfBirth}
                                onChange={(e) => setEditData({ ...editData, dateOfBirth: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Nickname</label>
                            <input
                                type="text"
                                value={editData.nickname}
                                onChange={(e) => setEditData({ ...editData, nickname: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Picture</label>
                            <input
                                type="text"
                                value={editData.picture}
                                onChange={(e) => setEditData({ ...editData, picture: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Position</label>
                            <select
                                value={editData.positionId}
                                onChange={(e) => setEditData({ ...editData, positionId: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Position</option>
                                {positions.map(position => (
                                    <option key={position.id} value={position.id}>
                                        {position.abbreviation}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Country</label>
                            <select
                                value={editData.countryId}
                                onChange={(e) => setEditData({ ...editData, countryId: e.target.value })}
                                className="input-field"
                            >
                                <option value="">Select Country</option>
                                {countries.map(country => (
                                    <option key={country.id} value={country.id}>{country.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label>Club ID</label>
                            <input
                                type="text"
                                value={editData.clubId}
                                onChange={(e) => setEditData({ ...editData, clubId: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>National Team ID</label>
                            <input
                                type="text"
                                value={editData.nationalTeamId}
                                onChange={(e) => setEditData({ ...editData, nationalTeamId: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label>Value</label>
                            <input
                                type="number"
                                value={editData.value}
                                onChange={(e) => setEditData({ ...editData, value: e.target.value })}
                                className="input-field"
                            />
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PlayerSearchAndEditForm;
