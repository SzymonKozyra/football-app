import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const EditPlayerContractForm = () => {
    const [searchType, setSearchType] = useState('player'); // 'player' lub 'team'
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [contractList, setContractList] = useState([]);
    const [selectedContractId, setSelectedContractId] = useState(null);

    const [playerId, setPlayerId] = useState(null);
    const [teamId, setTeamId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salary, setSalary] = useState('');
    const [transferFee, setTransferFee] = useState('');
    const [transferType, setTransferType] = useState('');
    const [error, setError] = useState(null);

    // Wyszukiwanie zawodników lub drużyn na podstawie wybranego typu
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (searchQuery && token) {
            const url = searchType === 'player'
                ? `http://localhost:8080/api/players/search?query=${searchQuery}`
                : `http://localhost:8080/api/teams/search?query=${searchQuery}`;

            axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setResults(response.data))
            .catch(error => {
                console.error('Błąd przy pobieraniu wyników:', error);
                setError('Nie udało się załadować wyników.');
            });
        } else {
            setResults([]);
        }
    }, [searchQuery, searchType]);

    const handleSelect = (item) => {
        if (searchType === 'player') {
            fetchContractsByPlayer(item.id);
        } else {
            fetchContractsByTeam(item.id);
        }
        setSearchQuery(item.name || `${item.firstName} ${item.lastName}`);
    };

    const fetchContractsByPlayer = (playerId) => {
        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/player-contracts/player/${playerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setContractList(response.data))
        .catch(error => {
            console.error('Błąd przy pobieraniu kontraktów zawodnika:', error);
            setError('Nie udało się załadować kontraktów zawodnika.');
        });
    };

    const fetchContractsByTeam = (teamId) => {
        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/player-contracts/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setContractList(response.data))
        .catch(error => {
            console.error('Błąd przy pobieraniu kontraktów klubu:', error);
            setError('Nie udało się załadować kontraktów klubu.');
        });
    };

    const handleContractSelect = (contractId) => {
        setSelectedContractId(contractId);
        fetchContractDetails(contractId);
    };

    const fetchContractDetails = (contractId) => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('Brak autoryzacji - zaloguj się ponownie.');
            return;
        }

        axios.get(`http://localhost:8080/api/player-contracts/${contractId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const contract = response.data;
            setStartDate(contract.startDate);
            setEndDate(contract.endDate);
            setSalary(contract.salary);
            setTransferFee(contract.transferFee);
            setTransferType(contract.transferType);
            setPlayerId(contract.player.playerId);
            setTeamId(contract.team.teamId);
            setError(null);
        })
        .catch(error => {
            console.error('Błąd przy pobieraniu szczegółów kontraktu:', error.response ? error.response.data : error.message);
            setError('Nie udało się załadować szczegółów kontraktu.');
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const updatedContractData = {
            startDate,
            endDate,
            salary,
            transferFee: transferType === "TRANSFER" ? transferFee : null,
            transferType
        };

        axios.put(`http://localhost:8080/api/player-contracts/${selectedContractId}`, updatedContractData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert('Kontrakt zawodnika został pomyślnie zaktualizowany');
            setSelectedContractId(null);
            setContractList([]);
        })
        .catch(error => {
            console.error('Błąd przy aktualizacji kontraktu:', error);
            setError('Wystąpił błąd podczas aktualizacji kontraktu.');
        });
    };

    return (
        <div className="form-container">
            <h2>Wybierz i Edytuj Kontrakt Zawodnika</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label>Wybierz typ wyszukiwania:</label>
                <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
                    <option value="player">Zawodnik</option>
                    <option value="team">Klub</option>
                </select>
            </div>

            <div>
                <label>Wyszukaj:</label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Wyszukaj ${searchType === 'player' ? 'zawodnika' : 'klub'}`}
                />
                {results.length > 0 && (
                    <ul>
                        {results.map((item) => (
                            <li key={item.id} onClick={() => handleSelect(item)}>
                                {searchType === 'player' ? `${item.firstName} ${item.lastName}` : item.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ul>
                {contractList.map((contract) => (
                    <li key={contract.id}>
                        Kontrakt ID: {contract.id}, Start: {contract.startDate}, Koniec: {contract.endDate}, Wynagrodzenie: {contract.salary}, Typ Transferu: {contract.transferType}
                        <button onClick={() => handleContractSelect(contract.id)}>Edytuj</button>
                    </li>
                ))}
            </ul>

            {selectedContractId && (
                <form onSubmit={handleSubmit}>
                    <h3>Edytuj Kontrakt</h3>

                    <label>Data Rozpoczęcia:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                    />

                    <label>Data Zakończenia:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                    />

                    <label>Pensja:</label>
                    <input
                        type="number"
                        value={salary}
                        onChange={(e) => setSalary(e.target.value)}
                        min="0"
                        required
                    />

                    <label>Typ Transferu:</label>
                    <select value={transferType} onChange={(e) => setTransferType(e.target.value)} required>
                        <option value="">Wybierz typ transferu</option>
                        <option value="LOAN">Wypożyczenie</option>
                        <option value="TRANSFER">Transfer</option>
                        <option value="END_LOAN">Koniec Wypożyczenia</option>
                    </select>

                    {transferType === "TRANSFER" && (
                        <div>
                            <label>Opłata Transferowa:</label>
                            <input
                                type="number"
                                value={transferFee}
                                onChange={(e) => setTransferFee(e.target.value)}
                                min="0"
                                required
                            />
                        </div>
                    )}

                    <button type="submit">Zapisz</button>
                </form>
            )}
        </div>
    );
};

export default EditPlayerContractForm;
