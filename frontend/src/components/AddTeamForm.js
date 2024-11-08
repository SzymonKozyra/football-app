import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddTeamForm = () => {
    const [teamName, setTeamName] = useState('');
    const [picture, setPicture] = useState('');
    const [isClub, setIsClub] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [leagueSearchQuery, setLeagueSearchQuery] = useState('');
    const [filteredLeagues, setFilteredLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [manualEntry, setManualEntry] = useState(true);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        if (leagueSearchQuery && token) {
            axios.get(`http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setFilteredLeagues(response.data))
                .catch(error => console.error('Error fetching leagues:', error));
        } else {
            setFilteredLeagues([]);
        }
    }, [searchQuery, leagueSearchQuery]);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        setLeagueSearchQuery(league.name);
        setFilteredLeagues([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        if (manualEntry) {
            const teamData = {
                name: teamName,
                picture: picture,
                isClub: isClub,
                leagueId: selectedLeague ? selectedLeague.id : null
            };

            axios.post('http://localhost:8080/api/teams/add', teamData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Team added successfully');
                    setTeamName('');
                    setPicture('');
                    setSearchQuery('');
                    setSelectedLeague(null);
                    setLeagueSearchQuery('');
                })
                .catch(error => {
                    console.error('Error adding team:', error);
                    alert('Failed to add team');
                });
        } else {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', fileType);

            axios.post('http://localhost:8080/api/teams/import', formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            })
                .then(response => {
                    alert('Teams imported successfully');
                    setFile(null);
                    setFileType('');
                })
                .catch(error => {
                    console.error('Error importing teams:', error);
                    alert('Failed to import teams');
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Add Team</h1>
            <div className="radio-group">
                <label>
                    <input
                        type="radio"
                        value="manual"
                        checked={manualEntry}
                        onChange={() => setManualEntry(true)}
                    />
                    Manual Entry
                </label>
                <label>
                    <input
                        type="radio"
                        value="import"
                        checked={!manualEntry}
                        onChange={() => setManualEntry(false)}
                    />
                    Import from File
                </label>
            </div>

            {manualEntry ? (
                <>
                    <div>
                        <label>Team Name</label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Picture</label>
                        <input
                            type="text"
                            placeholder="Enter picture filename"
                            value={picture}
                            onChange={(e) => setPicture(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Is Club?</label>
                        <select value={isClub} onChange={(e) => setIsClub(e.target.value === 'true')}>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>

                    <div>
                        <label>Search League</label>
                        <input
                            type="text"
                            value={leagueSearchQuery}
                            onChange={(e) => setLeagueSearchQuery(e.target.value)}
                            placeholder="Search for a league"
                        />
                        {filteredLeagues.length > 0 && (
                            <ul>
                                {filteredLeagues.map((league) => (
                                    <li key={league.id} onClick={() => handleLeagueSelect(league)}>
                                        {league.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <label>File Type</label>
                        <select value={fileType} onChange={(e) => setFileType(e.target.value)} required>
                            <option value="">Select file type</option>
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>

                    <div>
                        <label>Import Teams (CSV or JSON)</label>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </div>
                </>
            )}

            <button type="submit">Add Team</button>
        </form>
    );
};

export default AddTeamForm;
