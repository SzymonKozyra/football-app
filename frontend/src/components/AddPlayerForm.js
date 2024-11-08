import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddPlayerForm = () => {
    const [manualEntry, setManualEntry] = useState(true);
    const [playerData, setPlayerData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nickname: '',
        picture: '',
        positionId: '',
        countryId: '',
//        clubId: '',
//        nationalTeamId: '',
        value: ''
    });

    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
//    const [clubSearchQuery, setClubSearchQuery] = useState('');
//    const [nationalTeamSearchQuery, setNationalTeamSearchQuery] = useState('');
//    const [filteredClubs, setFilteredClubs] = useState([]);
//    const [filteredNationalTeams, setFilteredNationalTeams] = useState([]);
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState("csv");

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear() - 15;
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        axios.get('http://localhost:8080/api/positions', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => setPositions(res.data))
            .catch(error => console.error('Error fetching positions:', error));

        axios.get('http://localhost:8080/api/countries')
            .then(res => setCountries(res.data));
    }, []);

//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        if (clubSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/teams/search?query=${clubSearchQuery}&isClub=true`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//                .then(response => setFilteredClubs(response.data))
//                .catch(error => console.error('Error fetching clubs:', error));
//        } else {
//            setFilteredClubs([]);
//        }
//
//        if (nationalTeamSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/teams/search?query=${nationalTeamSearchQuery}&isClub=false`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//                .then(response => setFilteredNationalTeams(response.data))
//                .catch(error => console.error('Error fetching national teams:', error));
//        } else {
//            setFilteredNationalTeams([]);
//        }
//    }, [clubSearchQuery, nationalTeamSearchQuery]);

//    const handleClubSelect = (club) => {
//        setPlayerData({ ...playerData, clubId: club.id });
//        setClubSearchQuery(club.name);
//        setFilteredClubs([]);
//    };

//    const handleNationalTeamSelect = (nationalTeam) => {
//        setPlayerData({ ...playerData, nationalTeamId: nationalTeam.id });
//        setNationalTeamSearchQuery(nationalTeam.name);
//        setFilteredNationalTeams([]);
//    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (manualEntry) {
            axios.post('http://localhost:8080/api/players/add', playerData, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(res => alert('Player added successfully'))
                .catch(err => alert('Failed to add player'));
        } else {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", fileType);

            axios.post('http://localhost:8080/api/players/import', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => alert("Players imported successfully"))
                .catch(error => {
                    console.error("Error importing players:", error);
                    alert("Failed to import players");
                });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Add Player</h1>
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
                        <label>First Name</label>
                        <input
                            type="text"
                            value={playerData.firstName}
                            onChange={e => setPlayerData({ ...playerData, firstName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label>Last Name</label>
                        <input
                            type="text"
                            value={playerData.lastName}
                            onChange={e => setPlayerData({ ...playerData, lastName: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            max={getTodayDate()}
                            value={playerData.dateOfBirth}
                            onChange={e => setPlayerData({ ...playerData, dateOfBirth: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label>Nickname</label>
                        <input
                            type="text"
                            value={playerData.nickname}
                            onChange={e => setPlayerData({ ...playerData, nickname: e.target.value })}
                        />
                    </div>

                    <div>
                        <label>Picture</label>
                        <input
                            type="text"
                            value={playerData.picture}
                            onChange={e => setPlayerData({ ...playerData, picture: e.target.value })}
                        />
                    </div>

                    <div>
                        <label>Position</label>
                        <select
                            value={playerData.positionId}
                            onChange={e => setPlayerData({ ...playerData, positionId: e.target.value })}
                            required
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
                            value={playerData.countryId}
                            onChange={e => setPlayerData({ ...playerData, countryId: e.target.value })}
                            required
                        >
                            <option value="">Select Country</option>
                            {countries.map(country => (
                                <option key={country.id} value={country.id}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label>Value</label>
                        <input
                            type="number"
                            min="0"
                            value={playerData.value}
                            onChange={e => setPlayerData({ ...playerData, value: e.target.value })}
                        />
                    </div>
                </>
            ) : (
                <>
                    <div>
                        <label>File Type</label>
                        <select value={fileType} onChange={e => setFileType(e.target.value)} required>
                            <option value="csv">CSV</option>
                            <option value="json">JSON</option>
                        </select>
                    </div>

                    <div>
                        <label>Import Players (CSV or JSON)</label>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={e => setFile(e.target.files[0])}
                            required
                        />
                    </div>
                </>
            )}

            <button type="submit">{manualEntry ? 'Add Player' : 'Import Players'}</button>
        </form>
    );
};

export default AddPlayerForm;
