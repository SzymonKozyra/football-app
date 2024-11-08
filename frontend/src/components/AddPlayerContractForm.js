import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddPlayerContractForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salary, setSalary] = useState('');
    const [transferFee, setTransferFee] = useState('');
    const [transferType, setTransferType] = useState('');
    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);
    const [teamSearchQuery, setTeamSearchQuery] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (playerSearchQuery && token) {
            axios.get(`http://localhost:8080/api/players/search?query=${playerSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredPlayers(response.data))
            .catch(error => console.error('Error fetching players:', error));
        } else {
            setFilteredPlayers([]);
        }
    }, [playerSearchQuery]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (teamSearchQuery && token) {
            axios.get(`http://localhost:8080/api/teams/search?query=${teamSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredTeams(response.data))
            .catch(error => {
                console.error('Error fetching teams:', error);
                console.error('Error details:', error.response); // Wyświetli szczegóły błędu z odpowiedzi
            });
        } else {
            setFilteredTeams([]);
        }
    }, [teamSearchQuery]);

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
        setPlayerSearchQuery(`${player.firstName} ${player.lastName}`);
        setFilteredPlayers([]);
    };

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        setTeamSearchQuery(team.name);
        setFilteredTeams([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const contractData = {
            startDate,
            endDate,
            salary,
            ///////////
            transferFee: transferType === 'TRANSFER' ? transferFee : null,
            //////////////
            transferType,
            playerId: selectedPlayer ? selectedPlayer.id : null,
            teamId: selectedTeam ? selectedTeam.id : null
        };

        axios.post('http://localhost:8080/api/player-contracts/add', contractData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Player contract added successfully');
            // Resetowanie formularza po pomyślnym dodaniu
            setStartDate('');
            setEndDate('');
            setSalary('');
            setTransferFee('');
            setTransferType('')
            setSelectedPlayer(null);
            setPlayerSearchQuery('');
            setSelectedTeam(null);
            setTeamSearchQuery('');
            setError(null);
        })
        .catch(error => {
            console.error('Error adding contract:', error);
            if (error.response && error.response.status === 400) {
                setError(error.response.data); // Ustawienie komunikatu błędu z serwera
            } else {
                setError('Wystąpił błąd podczas dodawania kontraktu');
            }
        });
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Add Player Contract</h1>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label>Search Player</label>
                <input
                    type="text"
                    value={playerSearchQuery}
                    onChange={(e) => setPlayerSearchQuery(e.target.value)}
                    placeholder="Search for a player"
                />
                {filteredPlayers.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredPlayers.map((player) => (
                            <li
                                key={player.id}
                                onClick={() => handlePlayerSelect(player)}
                                style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}
                            >
                                {player.firstName} {player.lastName} ({player.nickname})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label>Search Team</label>
                <input
                    type="text"
                    value={teamSearchQuery}
                    onChange={(e) => setTeamSearchQuery(e.target.value)}
                    placeholder="Search for a team"
                />
                {filteredTeams.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredTeams.map((team) => (
                            <li
                                key={team.id}
                                onClick={() => handleTeamSelect(team)}
                                style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}
                            >
                                {team.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label>Start Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    max={getTodayDate()}
                    required
                />
            </div>

            <div>
                <label>End Date (optional)</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                />
            </div>

            <div>
                <label>Salary</label>
                <input
                    type="number"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    min="0"
                    required
                />
            </div>

            <div>
                <label>Typ transferu</label>
                <select value={transferType} onChange={(e) => setTransferType(e.target.value)} required>
                    <option value="">Wybierz typ transferu</option>
                    <option value="LOAN">Wypożyczenie</option>
                    <option value="TRANSFER">Transfer</option>
                    <option value="END_LOAN">Koniec wypożyczenia</option>
                </select>
            </div>

            {transferType === 'TRANSFER' && (
                <div>
                    <label>Kwota transferu</label>
                    <input
                        type="number"
                        value={transferFee}
                        onChange={(e) => setTransferFee(e.target.value)}
                        min="0"
                        required
                    />
                </div>
            )}


            <button type="submit">Dodaj Kontrakt</button>
        </form>
    );
};

export default AddPlayerContractForm;
