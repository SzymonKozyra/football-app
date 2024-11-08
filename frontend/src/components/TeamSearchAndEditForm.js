import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const TeamSearchAndEditForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [editData, setEditData] = useState({
        id: '',
        name: '',
        picture: '',
        leagueId: ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.get(`http://localhost:8080/api/teams/search?query=${searchQuery}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setTeams(response.data);
            })
            .catch(error => {
                console.error('Error fetching teams:', error);
            });
    };

    const handleEditClick = (team) => {
        setSelectedTeam(team);
        setEditData({
            id: team.id,
            name: team.name,
            picture: team.picture,
            leagueId: team.league ? team.league.id : ''
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.put(`http://localhost:8080/api/teams/${selectedTeam.id}`, editData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                alert('Team updated successfully');
                setSelectedTeam(null);
            })
            .catch(error => {
                console.error('Error updating team:', error);
                alert('Failed to update team');
            });
    };

    return (
        <div className="form-container">
            <h1>Search Team</h1>
            <form onSubmit={handleSearch} className="form-container">
                <input
                    type="text"
                    placeholder="Enter team name"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field"
                />
                <button type="submit">Search</button>
            </form>

            {teams.length > 0 && (
                <div>
                    <h3>Teams found:</h3>
                    <ul className="team-list">
                        {teams.map(team => (
                            <li key={team.id} className="list-item">
                                <strong>Id:</strong> {team.id}<br />
                                <strong>Name:</strong> {team.name}<br />
                                <strong>Picture:</strong>
                                <img
                                    src={`/assets/teams/${team.picture}`}
                                    alt={`${team.name}`}
                                    className="team-picture"
                                /><br />
                                <strong>Is Club:</strong> {team.isClub ? "Yes" : "No"}<br />
                                <strong>League:</strong> {team.league ? team.league.name : 'No League'}<br />
                                <button onClick={() => handleEditClick(team)}>Edit</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedTeam && (
                <div className="form-container">
                    <h3>Edit Team: {selectedTeam.name}</h3>
                    <form onSubmit={handleEditSubmit}>
                        <div>
                            <label>Team Name</label>
                            <input
                                type="text"
                                value={editData.name}
                                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
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
                            <img
                                src={`/assets/teams/${editData.picture}`}
                                alt={editData.name}
                                className="team-picture"
                            />
                        </div>
                        <div>
                            <label>League ID</label>
                            <input
                                type="number"
                                value={editData.leagueId}
                                onChange={(e) => setEditData({ ...editData, leagueId: e.target.value })}
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

export default TeamSearchAndEditForm;
