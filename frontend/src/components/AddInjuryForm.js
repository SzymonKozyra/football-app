//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//
//const AddInjuryForm = () => {
//    const [injuryData, setInjuryData] = useState({
//        type: '',
//        startDate: '',
//        endDate: '',
//        playerId: ''
//    });
//    const [players, setPlayers] = useState([]);
//    const [importMode, setImportMode] = useState(false);
//    const [file, setFile] = useState(null);
//    const [fileType, setFileType] = useState('');
//
//    useEffect(() => {
//        // Pobierz listę zawodników
//        axios.get('http://localhost:8080/api/players', {
//            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
//        })
//        .then(response => setPlayers(response.data))
//        .catch(error => console.error('Błąd podczas pobierania zawodników:', error));
//    }, []);
//
//    const handleInputChange = (e) => {
//        const { name, value } = e.target;
//        setInjuryData(prevData => ({
//            ...prevData,
//            [name]: value
//        }));
//    };
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        if (importMode) {
//            // Importuj dane z pliku
//            const formData = new FormData();
//            formData.append('file', file);
//            formData.append('type', fileType);
//
//            axios.post('http://localhost:8080/api/injuries/import', formData, {
//                headers: {
//                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
//                    'Content-Type': 'multipart/form-data'
//                }
//            })
//            .then(response => alert('Kontuzje zaimportowane pomyślnie'))
//            .catch(error => alert('Błąd podczas importowania kontuzji'));
//        } else {
//            // Dodaj kontuzję ręcznie
//            axios.post('http://localhost:8080/api/injuries/add', injuryData, {
//                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
//            })
//            .then(response => alert('Kontuzja dodana pomyślnie'))
//            .catch(error => alert('Błąd podczas dodawania kontuzji'));
//        }
//    };
//
//    return (
//        <div>
//            <h2>{importMode ? 'Importuj kontuzje' : 'Dodaj kontuzję'}</h2>
//            <button onClick={() => setImportMode(false)}>Ręczne dodawanie</button>
//            <button onClick={() => setImportMode(true)}>Importuj z pliku</button>
//
//            <form onSubmit={handleSubmit}>
//                {!importMode ? (
//                    <>
//                        <div>
//                            <label>Typ kontuzji</label>
//                            <input
//                                type="text"
//                                name="type"
//                                value={injuryData.type}
//                                onChange={handleInputChange}
//                                required
//                            />
//                        </div>
//                        <div>
//                            <label>Data rozpoczęcia</label>
//                            <input
//                                type="date"
//                                name="startDate"
//                                value={injuryData.startDate}
//                                onChange={handleInputChange}
//                                required
//                            />
//                        </div>
//                        <div>
//                            <label>Data zakończenia</label>
//                            <input
//                                type="date"
//                                name="endDate"
//                                value={injuryData.endDate}
//                                onChange={handleInputChange}
//                            />
//                        </div>
//                        <div>
//                            <label>Zawodnik</label>
//                            <select
//                                name="playerId"
//                                value={injuryData.playerId}
//                                onChange={handleInputChange}
//                                required
//                            >
//                                <option value="">Wybierz zawodnika</option>
//                                {players.map(player => (
//                                    <option key={player.id} value={player.id}>
//                                        {player.firstName} {player.lastName}
//                                    </option>
//                                ))}
//                            </select>
//                        </div>
//                    </>
//                ) : (
//                    <div>
//                        <label>Typ pliku</label>
//                        <select
//                            value={fileType}
//                            onChange={(e) => setFileType(e.target.value)}
//                            required
//                        >
//                            <option value="">Wybierz typ pliku</option>
//                            <option value="json">JSON</option>
//                            <option value="csv">CSV</option>
//                        </select>
//                        <input
//                            type="file"
//                            accept=".json,.csv"
//                            onChange={(e) => setFile(e.target.files[0])}
//                            required
//                        />
//                    </div>
//                )}
//                <button type="submit">{importMode ? 'Importuj kontuzje' : 'Dodaj kontuzję'}</button>
//            </form>
//        </div>
//    );
//};
//
//export default AddInjuryForm;



//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import '../App.css';
//
//const AddInjuryForm = () => {
//    const [importMode, setImportMode] = useState(false);
//    const [fileType, setFileType] = useState('');
//    const [file, setFile] = useState(null);
//    const [player, setPlayer] = useState([]);
//    const [playerSearchQuery, setPlayerSearchQuery] = useState('');
//    const [filteredPlayers, setFilteredPlayers] = useState([]);
//    const [type, setType] = useState('');
//    const [startDate, setStartDate] = useState('');
//    const [endDate, setEndDate] = useState('');
//
//
//    const [injuryData, setInjuryData] = useState({
//        type: '',
//        startDate: '',
//        endDate: '',
//        playerId: ''
//    });
//
//
//    //aktualna data
//    const getTodayDate = () => {
//            const today = new Date();
//            const year = today.getFullYear();
//            const month = String(today.getMonth() + 1).padStart(2, '0'); // Dodaje zero przed jednocyfrowym miesiącem
//            const day = String(today.getDate()).padStart(2, '0'); // Dodaje zero przed jednocyfrowym dniem
//            return `${year}-${month}-${day}`;
//        };
//
////    useEffect(() => {
////        // Pobierz listę zawodników
////        axios.get('http://localhost:8080/api/players', {
////            headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` }
////        })
////        .then(response => setPlayer(response.data))
////        .catch(error => console.error('Error fetching players:', error));
////    }, []);
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
//    const handleInputChange = (e) => {
//        const { name, value } = e.target;
//        setInjuryData({ ...injuryData, [name]: value });
//    };
//
//    const handlePlayerSelect = (player) => {
//        setInjuryData({ ...injuryData, playerId: player.id });
//        setPlayerSearchQuery(`${player.firstName} ${player.lastName}`);
//        setFilteredPlayers([]);
//    };
//
//    const handleSubmit = (e) => {
//        const token = localStorage.getItem('jwtToken');
//        e.preventDefault();
//        if (!importMode) {
//            // Ręczne dodawanie kontuzji
//            axios.post('http://localhost:8080/api/injuries/add', injuryData, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => {
//                alert('Injury added successfully');
//                setInjuryData({ type: '', startDate: '', endDate: '', playerId: '' });
//                setPlayerSearchQuery('');
//            })
//            .catch(error => console.error('Error adding injury:', error));
//        } else {
//            // Import kontuzji z pliku
//            const formData = new FormData();
//            formData.append('file', file);
//            formData.append('type', fileType);
//
//            axios.post('http://localhost:8080/api/injuries/import', formData, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => alert('Injuries imported successfully'))
//            .catch(error => console.error('Error importing injuries:', error));
//        }
//    };
//
//    return (
//        <form onSubmit={handleSubmit} className="form-container">
//            <h1>{importMode ? 'Importuj kontuzje' : 'Dodaj kontuzję'}</h1>
//            <div className="radio-group">
//                <label>
//                    <input
//                        type="radio"
//                        value="manual"
//                        checked={!importMode}
//                        onChange={() => setImportMode(false)}
//                    />
//                    Ręczne dodawanie
//                </label>
//                <label>
//                    <input
//                        type="radio"
//                        value="import"
//                        checked={importMode}
//                        onChange={() => setImportMode(true)}
//                    />
//                    Importuj z pliku
//                </label>
//            </div>
//
//            {!importMode ? (
//                <>
//                    <div>
//                        <label>Typ kontuzji</label>
//                        <input
//                            type="text"
//                            name="type"
//                            value={injuryData.type}
//                            onChange={handleInputChange}
//                            required
//                        />
//                    </div>
//                    <div>
//                        <label>Data rozpoczęcia</label>
//                        <input
//                            type="date"
//                            name="startDate"
//                            max={getTodayDate()}
//                            value={injuryData.startDate}
//                            onChange={handleInputChange}
//                            required
//                        />
//                    </div>
//                    <div>
//                        <label>Data zakończenia</label>
//                        <input
//                            type="date"
//                            name="endDate"
//                            min={getTodayDate()}
//                            value={injuryData.endDate}
//                            onChange={handleInputChange}
//                        />
//                    </div>
//                    <div>
//                        <label>Wyszukaj zawodnika</label>
//                        <input
//                            type="text"
//                            value={playerSearchQuery}
//                            onChange={(e) => setPlayerSearchQuery(e.target.value)}
//                            placeholder="Wprowadź nazwisko zawodnika"
//                        />
//                        {filteredPlayers.length > 0 && (
//                            <ul>
//                                {filteredPlayers.map((player) => (
//                                    <li key={player.id} onClick={() => handlePlayerSelect(player)}>
//                                        {player.firstName} {player.lastName}
//                                    </li>
//                                ))}
//                            </ul>
//                        )}
//                    </div>
//                </>
//            ) : (
//                <>
//                    <div>
//                        <label>Typ pliku</label>
//                        <select
//                            value={fileType}
//                            onChange={(e) => setFileType(e.target.value)}
//                            required
//                        >
//                            <option value="">Wybierz typ pliku</option>
//                            <option value="json">JSON</option>
//                            <option value="csv">CSV</option>
//                        </select>
//                    </div>
//                    <div>
//                        <label>Importuj kontuzje (CSV lub JSON)</label>
//                        <input
//                            type="file"
//                            accept=".csv,.json"
//                            onChange={(e) => setFile(e.target.files[0])}
//                            required
//                        />
//                    </div>
//                </>
//            )}
//
//            <button type="submit">{importMode ? 'Importuj kontuzje' : 'Dodaj kontuzję'}</button>
//        </form>
//    );
//};
//
//export default AddInjuryForm;



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


