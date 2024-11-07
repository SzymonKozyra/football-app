//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import '../App.css';
//
//const EditCoachContractForm = ({ contractId, onSubmit }) => {
//    const [startDate, setStartDate] = useState('');
//    const [endDate, setEndDate] = useState('');
//    const [salary, setSalary] = useState('');
//    const [transferFee, setTransferFee] = useState('');
//    const [error, setError] = useState(null);
//
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//        // Pobieranie szczegółów kontraktu do edycji
//        axios.get(`http://localhost:8080/api/coach-contracts/${contractId}`, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            const contract = response.data;
//            setStartDate(contract.startDate);
//            setEndDate(contract.endDate);
//            setSalary(contract.salary);
//            setTransferFee(contract.transferFee);
//        })
//        .catch(error => {
//            console.error('Error fetching contract details:', error);
//            setError('Error loading contract dateils');
//        });
//    }, [contractId]);
//
//    const handleSubmit = async (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const updatedContractData = {
//            startDate,
//            endDate,
//            salary,
//            transferFee
//        };
//
//        try {
//            await axios.put(`http://localhost:8080/api/coach-contracts/${contractId}`, updatedContractData, {
//                headers: { Authorization: `Bearer ${token}` }
//            });
//            alert('Trainer contract updated succesfully');
//            onSubmit(); // Wywołanie funkcji przekazanej jako props do odświeżenia po edycji
//        } catch (error) {
//            console.error('Error updating contract details:', error);
//            setError('Error updating contract dateils.');
//        }
//    };
//
//    return (
//        <form onSubmit={handleSubmit} className="form-container">
//            <h2>Edit Coach Contract</h2>
//
//            {error && <p style={{ color: 'red' }}>{error}</p>}
//
//            <label>Start Date:</label>
//            <input
//                type="date"
//                value={startDate}
//                onChange={(e) => setStartDate(e.target.value)}
//                required
//            />
//
//            <label>End Date:</label>
//            <input
//                type="date"
//                value={endDate}
//                onChange={(e) => setEndDate(e.target.value)}
//            />
//
//            <label>Salary:</label>
//            <input
//                type="number"
//                value={salary}
//                onChange={(e) => setSalary(e.target.value)}
//                min="0"
//                required
//            />
//
//            <label>Transfer Fee:</label>
//            <input
//                type="number"
//                value={transferFee}
//                onChange={(e) => setTransferFee(e.target.value)}
//                min="0"
//            />
//
//            <button type="submit">Zapisz</button>
//        </form>
//    );
//};
//
//export default EditCoachContractForm;



//          DZIALA


//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import '../App.css';
//
//const EditCoachContractForm = () => {
//    const [searchType, setSearchType] = useState('coach'); // 'coach' lub 'team'
//    const [searchQuery, setSearchQuery] = useState('');
//    const [results, setResults] = useState([]);
//    const [contractList, setContractList] = useState([]);
//    const [selectedContractId, setSelectedContractId] = useState(null);
//
//    const [startDate, setStartDate] = useState('');
//    const [endDate, setEndDate] = useState('');
//    const [salary, setSalary] = useState('');
//    const [transferFee, setTransferFee] = useState('');
//    const [coachId, setCoachId] = useState(''); // Stan dla coachId
//    const [teamId, setTeamId] = useState('');   // Stan dla teamId
//    const [coaches, setCoaches] = useState([]); // Stan dla listy trenerów
//    const [teams, setTeams] = useState([]);     // Stan dla listy drużyn
//    const [error, setError] = useState(null);
//
//    // Wyszukiwanie trenerów lub drużyn na podstawie wybranego typu
//    useEffect(() => {
//        const token = localStorage.getItem('jwtToken');
//        if (searchQuery && token) {
//            const url = searchType === 'coach'
//                ? `http://localhost:8080/api/coaches/search?query=${searchQuery}`
//                : `http://localhost:8080/api/teams/search?query=${searchQuery}`;
//
//            axios.get(url, {
//                headers: { Authorization: `Bearer ${token}` }
//            })
//            .then(response => setResults(response.data))
//            .catch(error => {
//                console.error('Error fetching results:', error);
//                setError('Nie udało się załadować wyników.');
//            });
//        } else {
//            setResults([]);
//        }
//    }, [searchQuery, searchType]);
//
//    const handleSelect = (item) => {
//        if (searchType === 'coach') {
//            fetchContractsByCoach(item.id);
//        } else {
//            fetchContractsByTeam(item.id);
//        }
//        setResults([]);
//        setSearchQuery(item.name || `${item.firstName} ${item.lastName}`);
//    };
//
//    const fetchContractsByCoach = (coachId) => {
//        const token = localStorage.getItem('jwtToken');
//        axios.get(`http://localhost:8080/api/coach-contracts/coach/${coachId}`, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => setContractList(response.data))
//        .catch(error => {
//            console.error('Error fetching contracts by coach:', error);
//            setError('Nie udało się załadować kontraktów trenera.');
//        });
//    };
//
//    const fetchContractsByTeam = (teamId) => {
//        const token = localStorage.getItem('jwtToken');
//        axios.get(`http://localhost:8080/api/coach-contracts/team/${teamId}`, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => setContractList(response.data))
//        .catch(error => {
//            console.error('Error fetching contracts by team:', error);
//            setError('Nie udało się załadować kontraktów klubu.');
//        });
//    };
//
//    const handleContractSelect = (contractId) => {
//        setSelectedContractId(contractId);
//        fetchContractDetails(contractId);
//    };
//
//    const fetchContractDetails = (contractId) => {
//        const token = localStorage.getItem('jwtToken');
//        console.log('Pobrany token JWT:', token);
//        if (!token) {
//            setError('Brak autoryzacji - zaloguj się ponownie.');
//            return;
//        }
//
//        axios.get(`http://localhost:8080/api/coach-contracts/${contractId}`, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            const contract = response.data;
//            setStartDate(contract.startDate);
//            setEndDate(contract.endDate);
//            setSalary(contract.salary);
//            setTransferFee(contract.transferFee);
//            setError(null);
//        })
//        .catch(error => {
//            console.error('Error fetching contract details:', error.response ? error.response.data : error.message);
//            setError('Nie udało się załadować szczegółów kontraktu.');
//        });
//    };
//
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//
//        const updatedContractData = {
//            startDate,
//            endDate,
//            salary,
//            transferFee
//        };
//
//        axios.put(`http://localhost:8080/api/coach-contracts/${selectedContractId}`, updatedContractData, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(() => {
//            alert('Kontrakt trenera został pomyślnie zaktualizowany');
//            setSelectedContractId(null);
//            setContractList([]);
//        })
//        .catch(error => {
//            console.error('Błąd przy aktualizacji kontraktu:', error);
//            setError('Wystąpił błąd podczas aktualizacji kontraktu.');
//        });
//    };
//
//    return (
//        <div className="form-container">
//            <h2>Wybierz i Edytuj Kontrakt Trenera</h2>
//
//            {error && <p style={{ color: 'red' }}>{error}</p>}
//
//            <div>
//                <label>Wybierz typ wyszukiwania:</label>
//                <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
//                    <option value="coach">Trener</option>
//                    <option value="team">Klub</option>
//                </select>
//            </div>
//
//            <div>
//                <label>Wyszukaj:</label>
//                <input
//                    type="text"
//                    value={searchQuery}
//                    onChange={(e) => setSearchQuery(e.target.value)}
//                    placeholder={`Wyszukaj ${searchType === 'coach' ? 'trenera' : 'klub'}`}
//                />
//                {results.length > 0 && (
//                    <ul>
//                        {results.map((item) => (
//                            <li key={item.id} onClick={() => handleSelect(item)}>
//                                {searchType === 'coach' ? `${item.firstName} ${item.lastName}` : item.name}
//                            </li>
//                        ))}
//                    </ul>
//                )}
//            </div>
//
//            <ul>
//                {contractList.map((contract) => (
//                    <li key={contract.id}>
//                        Kontrakt ID: {contract.id}, Start: {contract.startDate}, Koniec: {contract.endDate}
//                        <button onClick={() => handleContractSelect(contract.id)}>Edytuj</button>
//                    </li>
//                ))}
//            </ul>
//
//            {selectedContractId && (
//                <form onSubmit={handleSubmit}>
//                    <h3>Edytuj Kontrakt</h3>
//
//                    <label>Data Rozpoczęcia:</label>
//                    <input
//                        type="date"
//                        value={startDate}
//                        onChange={(e) => setStartDate(e.target.value)}
//                        required
//                    />
//
//                    <label>Data Zakończenia:</label>
//                    <input
//                        type="date"
//                        value={endDate}
//                        onChange={(e) => setEndDate(e.target.value)}
//                    />
//
//                    <label>Pensja:</label>
//                    <input
//                        type="number"
//                        value={salary}
//                        onChange={(e) => setSalary(e.target.value)}
//                        min="0"
//                        required
//                    />
//
//                    <label>Opłata Transferowa:</label>
//                    <input
//                        type="number"
//                        value={transferFee}
//                        onChange={(e) => setTransferFee(e.target.value)}
//                        min="0"
//                    />
//
//                    {/* Dodaj pole do wyboru trenera */}
//                    <label>Wybierz Trenera:</label>
//                    <select onChange={(e) => setCoachId(e.target.value)} value={coachId} required>
//                        <option value="">Wybierz trenera</option>
//                        {coaches.map((coach) => (
//                            <option key={coach.id} value={coach.id}>
//                                {coach.firstName} {coach.lastName}
//                            </option>
//                        ))}
//                    </select>
//
//                    {/* Dodaj pole do wyboru klubu */}
//                    <label>Wybierz Klub:</label>
//                    <select onChange={(e) => setTeamId(e.target.value)} value={teamId} required>
//                        <option value="">Wybierz klub</option>
//                        {teams.map((team) => (
//                            <option key={team.id} value={team.id}>
//                                {team.name}
//                            </option>
//                        ))}
//                    </select>
//
//                    <button type="submit">Zapisz</button>
//                </form>
//            )}
//
//        </div>
//    );
//};
//
//export default EditCoachContractForm;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const EditCoachContractForm = () => {
    const [searchType, setSearchType] = useState('coach'); // 'coach' lub 'team'
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [contractList, setContractList] = useState([]);
    const [selectedContractId, setSelectedContractId] = useState(null);

    const [coachId, setCoachId] = useState(null);
    const [teamId, setTeamId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salary, setSalary] = useState('');
    const [transferFee, setTransferFee] = useState('');
    const [error, setError] = useState(null);

    // Wyszukiwanie trenerów lub drużyn na podstawie wybranego typu
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (searchQuery && token) {
            const url = searchType === 'coach'
                ? `http://localhost:8080/api/coaches/search?query=${searchQuery}`
                : `http://localhost:8080/api/teams/search?query=${searchQuery}`;

            axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setResults(response.data))
            .catch(error => {
                console.error('Error fetching results:', error);
                setError('Nie udało się załadować wyników.');
            });
        } else {
            setResults([]);
        }
    }, [searchQuery, searchType]);

    const handleSelect = (item) => {
        if (searchType === 'coach') {
            fetchContractsByCoach(item.id);
        } else {
            fetchContractsByTeam(item.id);
        }
        //setResults([]);
        setSearchQuery(item.name || `${item.firstName} ${item.lastName}`);
    };

    const fetchContractsByCoach = (coachId) => {
        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/coach-contracts/coach/${coachId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setContractList(response.data))
        .catch(error => {
            console.error('Error fetching contracts by coach:', error);
            setError('Nie udało się załadować kontraktów trenera.');
        });
    };

    const fetchContractsByTeam = (teamId) => {
        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/coach-contracts/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => setContractList(response.data))
        .catch(error => {
            console.error('Error fetching contracts by team:', error);
            setError('Nie udało się załadować kontraktów klubu.');
        });
    };

//    const handleContractSelect = (contractId) => {
//        setSelectedContractId(contractId);
//        fetchContractDetails(contractId);
//    };
    const handleContractSelect = (contractId) => {
        if (contractId) {
            setSelectedContractId(contractId);
            fetchContractDetails(contractId);
        } else {
            console.error("Invalid contract ID:", contractId);
            setError("Nieprawidłowy ID kontraktu.");
        }
    };


//    const fetchContractDetails = (contractId) => {
//        const token = localStorage.getItem('jwtToken');
//        if (!token) {
//            setError('Brak autoryzacji - zaloguj się ponownie.');
//            return;
//        }
//
//        axios.get(`http://localhost:8080/api/coach-contracts/${contractId}`, {
//            headers: { Authorization: `Bearer ${token}` }
//        })
//        .then(response => {
//            const contract = response.data;
//            setStartDate(contract.startDate);
//            setEndDate(contract.endDate);
//            setSalary(contract.salary);
//            setTransferFee(contract.transferFee);
//            setError(null);
//        })
//        .catch(error => {
//            console.error('Error fetching contract details:', error.response ? error.response.data : error.message);
//            setError('Nie udało się załadować szczegółów kontraktu.');
//        });
//    };
    const fetchContractDetails = (contractId) => {
        if (!contractId) {
            console.error("Contract ID is null or undefined.");
            setError("Nieprawidłowy ID kontraktu.");
            return;
        }

        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError('Brak autoryzacji - zaloguj się ponownie.');
            return;
        }

        axios.get(`http://localhost:8080/api/coach-contracts/${contractId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            const contract = response.data;
            setStartDate(contract.startDate);
            setEndDate(contract.endDate);
            setSalary(contract.salary);
            setTransferFee(contract.transferFee);
            setCoachId(contract.coach.coachId);  // Ustaw coachId jeśli jest dostępne
            setTeamId(contract.team.teamId);    // Ustaw teamId jeśli jest dostępne
            setError(null);
        })
        .catch(error => {
            console.error('Error fetching contract details:', error.response ? error.response.data : error.message);
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
            transferFee
        };

        axios.put(`http://localhost:8080/api/coach-contracts/${selectedContractId}`, updatedContractData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            alert('Kontrakt trenera został pomyślnie zaktualizowany');
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
            <h2>Wybierz i Edytuj Kontrakt Trenera</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label>Wybierz typ wyszukiwania:</label>
                <select onChange={(e) => setSearchType(e.target.value)} value={searchType}>
                    <option value="coach">Trener</option>
                    <option value="team">Klub</option>
                </select>
            </div>

            <div>
                <label>Wyszukaj:</label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Wyszukaj ${searchType === 'coach' ? 'trenera' : 'klub'}`}
                />
                {results.length > 0 && (
                    <ul>
                        {results.map((item) => (
                            <li key={item.id} onClick={() => handleSelect(item)}>
                                {searchType === 'coach' ? `${item.firstName} ${item.lastName}` : item.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <ul>
                {contractList.map((contract) => (
                    <li key={contract.id}>
                        Kontrakt ID: {contract.id}, Start: {contract.startDate}, Koniec: {contract.endDate}, Coach: {contract.coach.firstName} {contract.coach.lastName}, Team: {contract.team.name}, Wynagrodzenie: {contract.salary}, Opłata transferowa: {contract.transferFee}
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

                    <label>Opłata Transferowa:</label>
                    <input
                        type="number"
                        value={transferFee}
                        onChange={(e) => setTransferFee(e.target.value)}
                        min="0"
                    />

                    <button type="submit">Zapisz</button>
                </form>
            )}

        </div>
    );
};

export default EditCoachContractForm;
