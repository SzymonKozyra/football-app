import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddInjuryForm = () => {
    const [importMode, setImportMode] = useState(false);
    const [fileType, setFileType] = useState('');
    const [file, setFile] = useState(null);

    const [injuryType, setInjuryType] = useState('');
    const [injuryStartDate, setInjuryStartDate] = useState('');
    const [injuryEndDate, setInjuryEndDate] = useState('');

    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
    const [filteredPlayers, setFilteredPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState(null);

    const resetForm = () => {
        setInjuryType('');
        setInjuryStartDate('');
        setInjuryEndDate('');
        setPlayerSearchQuery('');
        setFilteredPlayers([]);
        setSelectedPlayer(null);
        setFileType('');
        setFile(null);
    };

    const injuryData = {
        playerId: selectedPlayer?.id,
        type: injuryType,
        startDate: injuryStartDate,
        endDate: injuryEndDate
    };

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Dodaje zero przed jednocyfrowym miesiącem
        const day = String(today.getDate()).padStart(2, '0'); // Dodaje zero przed jednocyfrowym dniem
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        console.log(token);
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
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (!token) {
            console.error('Authorization token is missing');
            return;
        }

        const injuryData = {
            playerId: selectedPlayer?.id,
            type: injuryType,
            startDate: injuryStartDate,
            endDate: injuryEndDate
        };
        console.log(injuryData);


        axios.post('http://localhost:8080/api/injuries/add', injuryData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Injury added successfully');
            resetForm();
        })
        .catch(error => {
            console.error('Error adding injury:', error);
            alert('Failed to add injury');

        });

    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{importMode ? 'Importuj kontuzje' : 'Dodaj kontuzję'}</h1>
            <div className="radio-group">
                <label>
                    <input
                        type="radio"
                        value="manual"
                        checked={!importMode}
                        onChange={() => setImportMode(false)}
                    />
                    Ręczne dodawanie
                </label>
                <label>
                    <input
                        type="radio"
                        value="import"
                        checked={importMode}
                        onChange={() => setImportMode(true)}
                    />
                    Importuj z pliku
                </label>
            </div>

            {!importMode ? (
                <>
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
                    <div>
                        <label>Wyszukaj zawodnika</label>
                        <input
                            type="text"
                            value={playerSearchQuery}
                            onChange={(e) => setPlayerSearchQuery(e.target.value)}
                            placeholder="Wprowadź imię i nazwisko zawodnika"
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
                </>
            ) : (
                <>
                    <div>
                        <label>Typ pliku</label>
                        <select
                            value={fileType}
                            onChange={(e) => setFileType(e.target.value)}
                            required
                        >
                            <option value="">Wybierz typ pliku</option>
                            <option value="json">JSON</option>
                            <option value="csv">CSV</option>
                        </select>
                    </div>
                    <div>
                        <label>Importuj kontuzje (CSV lub JSON)</label>
                        <input
                            type="file"
                            accept=".csv,.json"
                            onChange={(e) => setFile(e.target.files[0])}
                            required
                        />
                    </div>
                </>
            )}

            <button type="submit">{importMode ? 'Importuj kontuzje' : 'Dodaj kontuzję'}</button>
        </form>
    );
};

export default AddInjuryForm;


