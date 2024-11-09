//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import '../App.css';
//
//const EditInjuryForm = ({ injuryId }) => {
//    const [injuryType, setInjuryType] = useState('');
//    const [injuryStartDate, setInjuryStartDate] = useState('');
//    const [injuryEndDate, setInjuryEndDate] = useState('');
//    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
//    const [filteredPlayers, setFilteredPlayers] = useState([]);
//    const [selectedPlayer, setSelectedPlayer] = useState(null);
//
//    const resetForm = () => {
//        setInjuryType('');
//        setInjuryStartDate('');
//        setInjuryEndDate('');
//        setPlayerSearchQuery('');
//        setFilteredPlayers([]);
//        setSelectedPlayer(null);
//    };
//
//    const getTodayDate = () => {
//        const today = new Date();
//        const year = today.getFullYear();
//        const month = String(today.getMonth() + 1).padStart(2, '0');
//        const day = String(today.getDate()).padStart(2, '0');
//        return `${year}-${month}-${day}`;
//    };
//
//    // Załaduj dane kontuzji na podstawie injuryId
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//        if (injuryId && token) {
//            axios.get(`http://localhost:8080/api/injuries/${injuryId}`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => {
//                const injury = response.data;
//                setInjuryType(injury.type);
//                setInjuryStartDate(injury.startDate);
//                setInjuryEndDate(injury.endDate);
//                setSelectedPlayer(injury.player);
//                setPlayerSearchQuery(`${injury.player.firstName} ${injury.player.lastName}`);
//            })
//            .catch(error => console.error('Error fetching injury data:', error));
//        }
//    }, [injuryId]);
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//        if (playerSearchQuery && token) {
//            axios.get(`http://localhost:8080/api/players/search?query=${playerSearchQuery}`, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => setFilteredPlayers(response.data))
//            .catch(error => console.error('Error fetching players:', error));
//        } else {
//            setFilteredPlayers([]);
//        }
//    }, [playerSearchQuery]);
//
//    const handlePlayerSelect = (player) => {
//        setSelectedPlayer(player);
//        setPlayerSearchQuery(`${player.firstName} ${player.lastName}`);
//        setFilteredPlayers([]);
//    };
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        if (!token) {
//            console.error('Authorization token is missing');
//            return;
//        }
//
//        const injuryData = {
//            playerId: selectedPlayer?.id,
//            type: injuryType,
//            startDate: injuryStartDate,
//            endDate: injuryEndDate
//        };
//
//        axios.put(`http://localhost:8080/api/injuries/update/${injuryId}`, injuryData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            alert('Injury updated successfully');
//            resetForm();
//        })
//        .catch(error => {
//            console.error('Error updating injury:', error);
//            alert('Failed to update injury');
//        });
//    };
//
//    return (
//        <form onSubmit={handleSubmit} className="form-container">
//            <h1>Edytuj kontuzję</h1>
//            <div>
//                <label>Typ kontuzji</label>
//                <input
//                    type="text"
//                    value={injuryType}
//                    onChange={(e) => setInjuryType(e.target.value)}
//                    required
//                />
//            </div>
//            <div>
//                <label>Data rozpoczęcia</label>
//                <input
//                    type="date"
//                    max={getTodayDate()}
//                    value={injuryStartDate}
//                    onChange={(e) => setInjuryStartDate(e.target.value)}
//                    required
//                />
//            </div>
//            <div>
//                <label>Data zakończenia</label>
//                <input
//                    type="date"
//                    min={injuryStartDate}
//                    value={injuryEndDate}
//                    onChange={(e) => setInjuryEndDate(e.target.value)}
//                />
//            </div>
//            <div>
//                <label>Wyszukaj zawodnika</label>
//                <input
//                    type="text"
//                    value={playerSearchQuery}
//                    onChange={(e) => setPlayerSearchQuery(e.target.value)}
//                    placeholder="Search for a player"
//                />
//                {filteredPlayers.length > 0 && (
//                    <ul>
//                        {filteredPlayers.map(player => (
//                            <li key={player.id} onClick={() => handlePlayerSelect(player)}>
//                                {player.firstName} {player.lastName}
//                            </li>
//                        ))}
//                    </ul>
//                )}
//            </div>
//            <button type="submit">Zapisz zmiany</button>
//        </form>
//    );
//};
//
//export default EditInjuryForm;








import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const EditInjuryForm = () => {
    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const [injuries, setInjuries] = useState([]);
    const [selectedInjury, setSelectedInjury] = useState(null);

    const [injuryType, setInjuryType] = useState('');
    const [injuryStartDate, setInjuryStartDate] = useState('');
    const [injuryEndDate, setInjuryEndDate] = useState('');

    const resetForm = () => {
        setInjuryType('');
        setInjuryStartDate('');
        setInjuryEndDate('');
        setSelectedInjury(null);
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Wyszukiwanie zawodników
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

    const handlePlayerSelect = (player) => {
        setSelectedPlayer(player);
        setPlayerSearchQuery(`${player.firstName} ${player.lastName}`);
        setFilteredPlayers([]);

        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/injuries/player/${player.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setInjuries(response.data))
        .catch(error => console.error('Error fetching injuries:', error));
    };

    const handleInjurySelect = (injury) => {
        setSelectedInjury(injury);
        setInjuryType(injury.type);
        setInjuryStartDate(injury.startDate);
        setInjuryEndDate(injury.endDate);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (!token || !selectedInjury) {
            console.error('Authorization token or injury not selected');
            return;
        }

        const injuryData = {
            playerId: selectedPlayer.id,
            type: injuryType,
            startDate: injuryStartDate,
            endDate: injuryEndDate
        };

        axios.put(`http://localhost:8080/api/injuries/${selectedInjury.id}`, injuryData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Injury updated successfully');
            resetForm();
        })
        .catch(error => {
            console.error('Error updating injury:', error);
            alert('Failed to update injury');
        });
    };

    return (
        <div className="form-container">
            <h1>Edytuj kontuzję</h1>

            <div>
                <label>Wyszukaj zawodnika</label>
                <input
                    type="text"
                    value={playerSearchQuery}
                    onChange={(e) => setPlayerSearchQuery(e.target.value)}
                    placeholder="Search for a player"
                />
                {filteredPlayers.length > 0 && (
                    <ul>
                        {filteredPlayers.map(player => (
                            <li key={player.id} onClick={() => handlePlayerSelect(player)}>
                                {player.firstName} {player.lastName}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {selectedPlayer && (
                <div>
                    <h2>Kontuzje {selectedPlayer.firstName} {selectedPlayer.lastName}</h2>
                    <ul>
                        {injuries.map(injury => (
                            <li key={injury.id} onClick={() => handleInjurySelect(injury)}>
                                {injury.type} (od {injury.startDate} do {injury.endDate || 'obecnie'})
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedInjury && (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Typ kontuzji</label>
                        <input
                            type="text"
                            value={injuryType}
                            onChange={(e) => setInjuryType(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Data rozpoczęcia</label>
                        <input
                            type="date"
                            max={getTodayDate()}
                            value={injuryStartDate}
                            onChange={(e) => setInjuryStartDate(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Data zakończenia</label>
                        <input
                            type="date"
                            min={injuryStartDate}
                            value={injuryEndDate}
                            onChange={(e) => setInjuryEndDate(e.target.value)}
                        />
                    </div>
                    <button type="submit">Zapisz zmiany</button>
                </form>
            )}
        </div>
    );
};

export default EditInjuryForm;
