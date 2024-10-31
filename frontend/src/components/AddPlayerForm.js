//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import '../App.css';
//
//const AddPlayerForm = () => {
//    const [playerData, setPlayerData] = useState({
//        firstName: '',
//        lastName: '',
//        dateOfBirth: '',
//        nickname: '',
//        picture: '',
//        positionId: '',
//        countryId: '',
//        clubId: '',
//        nationalTeamId: '',
//        value: ''
//    });
//
//    const [positions, setPositions] = useState([]);
//    const [countries, setCountries] = useState([]);
//    const [teams, setTeams] = useState([]);
//    const [teamSearchQuery, setTeamSearchQuery] = useState('');
//    const [filteredTeams, setFilteredTeams] = useState([]);
//
//    const getTodayDate = () => {
//        const today = new Date();
//        const year = today.getFullYear() - 15;
//        const month = String(today.getMonth() + 1).padStart(2, '0');
//        const day = String(today.getDate()).padStart(2, '0');
//        return `${year}-${month}-${day}`;
//    };
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        axios.get('http://localhost:8080/api/positions', { headers: { Authorization: `Bearer ${token}` } })
//            .then(res => setPositions(res.data))
//            .catch(error => console.error('Error fetching positions:', error));
//
//        axios.get('http://localhost:8080/api/countries')
//            .then(res => setCountries(res.data));
//
//        axios.get('http://localhost:8080/api/teams', { headers: { Authorization: `Bearer ${token}` } })
//            .then(res => setTeams(res.data))
//            .catch(error => console.error('Error fetching teams:', error));
//    }, []);
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//
//        if (teamSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/teams/search?query=${teamSearchQuery}`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => setFilteredTeams(response.data))
//            .catch(error => console.error('Error fetching teams:', error));
//        } else {
//            setFilteredTeams([]);
//        }
//    }, [teamSearchQuery]);
//
//    const handleTeamSelect = (team) => {
//        setPlayerData({ ...playerData, clubId: team.id });
//        setTeamSearchQuery(`${team.name}`);
//        setFilteredTeams([]);
//    };
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        axios.post('http://localhost:8080/api/players/add', playerData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//            .then(res => alert('Player added successfully'))
//            .catch(err => alert('Failed to add player'));
//    };
//
//    return (
//        <form onSubmit={handleSubmit}>
//            <div>
//                <label>First Name</label>
//                <input type="text" value={playerData.firstName} onChange={e => setPlayerData({ ...playerData, firstName: e.target.value })} required />
//            </div>
//
//            <div>
//                <label>Last Name</label>
//                <input type="text" value={playerData.lastName} onChange={e => setPlayerData({ ...playerData, lastName: e.target.value })} required />
//            </div>
//
//            <div>
//                <label>Date of Birth</label>
//                <input type="date" max={getTodayDate()} value={playerData.dateOfBirth} onChange={e => setPlayerData({ ...playerData, dateOfBirth: e.target.value })} required />
//            </div>
//
//            <div>
//                <label>Nickname</label>
//                <input type="text" value={playerData.nickname} onChange={e => setPlayerData({ ...playerData, nickname: e.target.value })} />
//            </div>
//
//            <div>
//                <label>Picture</label>
//                <input type="text" value={playerData.picture} onChange={e => setPlayerData({ ...playerData, picture: e.target.value })} />
//            </div>
//
//            <div>
//                <label>Position</label>
//                <select value={playerData.positionId} onChange={e => setPlayerData({ ...playerData, positionId: e.target.value })} required>
//                    <option value="">Select Position</option>
//                    {positions.map(position => <option key={position.id} value={position.id}>{position.abbreviation}</option>)}
//                </select>
//            </div>
//
//            <div>
//                <label>Country</label>
//                <select value={playerData.countryId} onChange={e => setPlayerData({ ...playerData, countryId: e.target.value })} required>
//                    <option value="">Select Country</option>
//                    {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
//                </select>
//            </div>
//
//            <div>
//                <label>Search Team</label>
//                <input
//                    type="text"
//                    value={teamSearchQuery}
//                    onChange={e => setTeamSearchQuery(e.target.value)}
//                    placeholder="Search for a team"
//                />
//                {filteredTeams.length > 0 && (
//                    <ul style={{ listStyleType: 'none', padding: 0 }}>
//                        {filteredTeams.map((team) => (
//                            <li key={team.id} onClick={() => handleTeamSelect(team)} style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}>
//                                {team.name}
//                            </li>
//                        ))}
//                    </ul>
//                )}
//            </div>
//
//            <div>
//                <label>National Team ID</label>
//                <input
//                    type="number"
//                    value={playerData.nationalTeamId}
//                    onChange={e => setPlayerData({ ...playerData, nationalTeamId: e.target.value })}
//                />
//            </div>
//
//            <div>
//                <label>Value</label>
//                <input type="number" min="0" value={playerData.value} onChange={e => setPlayerData({ ...playerData, value: e.target.value })} />
//            </div>
//
//            <button type="submit">Add Player</button>
//        </form>
//    );
//};
//
//export default AddPlayerForm;



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
        value: ''
    });

    const [positions, setPositions] = useState([]);
    const [countries, setCountries] = useState([]);
    const [clubSearchQuery, setClubSearchQuery] = useState('');
    const [nationalTeamSearchQuery, setNationalTeamSearchQuery] = useState('');
    const [filteredClubs, setFilteredClubs] = useState([]);
    const [filteredNationalTeams, setFilteredNationalTeams] = useState([]);

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

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');

        // Zapytanie dla wyszukiwania klubów
        if (clubSearchQuery && token) {
            axios.get(`http://localhost:8080/api/teams/search?query=${clubSearchQuery}&isClub=true`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredClubs(response.data))
            .catch(error => console.error('Error fetching clubs:', error));
        } else {
            setFilteredClubs([]);
        }

        // Zapytanie dla wyszukiwania reprezentacji narodowych
        if (nationalTeamSearchQuery && token) {
            axios.get(`http://localhost:8080/api/teams/search?query=${nationalTeamSearchQuery}&isClub=false`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredNationalTeams(response.data))
            .catch(error => console.error('Error fetching national teams:', error));
        } else {
            setFilteredNationalTeams([]);
        }
    }, [clubSearchQuery, nationalTeamSearchQuery]);

    const handleClubSelect = (club) => {
        setPlayerData({ ...playerData, clubId: club.id });
        setClubSearchQuery(club.name);
        setFilteredClubs([]);
    };

    const handleNationalTeamSelect = (nationalTeam) => {
        setPlayerData({ ...playerData, nationalTeamId: nationalTeam.id });
        setNationalTeamSearchQuery(nationalTeam.name);
        setFilteredNationalTeams([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        axios.post('http://localhost:8080/api/players/add', playerData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => alert('Player added successfully'))
            .catch(err => alert('Failed to add player'));
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>First Name</label>
                <input type="text" value={playerData.firstName} onChange={e => setPlayerData({ ...playerData, firstName: e.target.value })} required />
            </div>

            <div>
                <label>Last Name</label>
                <input type="text" value={playerData.lastName} onChange={e => setPlayerData({ ...playerData, lastName: e.target.value })} required />
            </div>

            <div>
                <label>Date of Birth</label>
                <input type="date" max={getTodayDate()} value={playerData.dateOfBirth} onChange={e => setPlayerData({ ...playerData, dateOfBirth: e.target.value })} required />
            </div>

            <div>
                <label>Nickname</label>
                <input type="text" value={playerData.nickname} onChange={e => setPlayerData({ ...playerData, nickname: e.target.value })} />
            </div>

            <div>
                <label>Picture</label>
                <input type="text" value={playerData.picture} onChange={e => setPlayerData({ ...playerData, picture: e.target.value })} />
            </div>

            <div>
                <label>Position</label>
                <select value={playerData.positionId} onChange={e => setPlayerData({ ...playerData, positionId: e.target.value })} required>
                    <option value="">Select Position</option>
                    {positions.map(position => <option key={position.id} value={position.id}>{position.abbreviation}</option>)}
                </select>
            </div>

            <div>
                <label>Country</label>
                <select value={playerData.countryId} onChange={e => setPlayerData({ ...playerData, countryId: e.target.value })} required>
                    <option value="">Select Country</option>
                    {countries.map(country => <option key={country.id} value={country.id}>{country.name}</option>)}
                </select>
            </div>

            <div>
                <label>Search Club</label>
                <input
                    type="text"
                    value={clubSearchQuery}
                    onChange={e => setClubSearchQuery(e.target.value)}
                    placeholder="Search for a club"
                />
                {filteredClubs.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredClubs.map((club) => (
                            <li key={club.id} onClick={() => handleClubSelect(club)} style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}>
                                {club.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label>Search National Team</label>
                <input
                    type="text"
                    value={nationalTeamSearchQuery}
                    onChange={e => setNationalTeamSearchQuery(e.target.value)}
                    placeholder="Search for a national team"
                />
                {filteredNationalTeams.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredNationalTeams.map((nationalTeam) => (
                            <li key={nationalTeam.id} onClick={() => handleNationalTeamSelect(nationalTeam)} style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}>
                                {nationalTeam.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label>Value</label>
                <input type="number" min="0" value={playerData.value} onChange={e => setPlayerData({ ...playerData, value: e.target.value })} />
            </div>

            <button type="submit">Add Player</button>
        </form>
    );
};

export default AddPlayerForm;

