import React, { useState } from 'react';
import axios from 'axios';

const AddTeamForm = () => {
    const [teamName, setTeamName] = useState('');
    const [picture, setPicture] = useState('');
    const [isClub, setIsClub] = useState(true);
    const [leagueId, setLeagueId] = useState('');
    const [coachId, setCoachId] = useState('');
    const [manualEntry, setManualEntry] = useState(true);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        if (manualEntry) {
            // Manual entry submission
            const teamData = {
                name: teamName,
                picture: picture,
                isClub: isClub,
                leagueId: parseInt(leagueId),
                coachId: parseInt(coachId)
            };

            axios.post('http://localhost:8080/api/teams/add', teamData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => {
                    alert('Team added successfully');
                    // Reset form fields
                    setTeamName('');
                    setPicture('');
                    setLeagueId('');
                    setCoachId('');
                })
                .catch(error => {
                    console.error('Error adding team:', error);
                    alert('Failed to add team');
                });
        } else {
            // File import submission
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
        <form onSubmit={handleSubmit}>
            <div>
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
                        <label>League ID</label>
                        <input
                            type="number"
                            value={leagueId}
                            onChange={(e) => setLeagueId(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>Coach ID</label>
                        <input
                            type="number"
                            value={coachId}
                            onChange={(e) => setCoachId(e.target.value)}
                            required
                        />
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
