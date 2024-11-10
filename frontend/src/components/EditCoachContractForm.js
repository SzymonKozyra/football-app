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
import { Container, Form, ListGroup, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditCoachContractForm = () => {
    const [searchType, setSearchType] = useState('coach'); // 'coach' or 'team'
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);
    const [contractList, setContractList] = useState([]);
    const [selectedContract, setSelectedContract] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salary, setSalary] = useState('');
    const [transferFee, setTransferFee] = useState('');
    const [noContractsMessage, setNoContractsMessage] = useState(''); // Message when no contracts are found

    // Load suggestions as the user types
    useEffect(() => {
        if (searchQuery) {
            const token = localStorage.getItem('jwtToken');
            const url = searchType === 'coach'
                ? `http://localhost:8080/api/coaches/search?query=${searchQuery}`
                : `http://localhost:8080/api/teams/search?query=${searchQuery}`;

            axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setSuggestions(response.data))
                .catch(error => {
                    console.error('Error fetching suggestions:', error);
                });
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, searchType]);

    // Set selected suggestion ID and populate input on suggestion click
    const handleSelectSuggestion = (item) => {
        setSearchQuery(searchType === 'coach' ? `${item.firstName} ${item.lastName}` : item.name);
        setSelectedSuggestionId(item.id);
        setSuggestions([]);  // Clear suggestions after selecting one
    };

    // Final search on "Search" button click, using the selected suggestion ID
    const handleSearch = () => {
        if (!selectedSuggestionId) {
            setNoContractsMessage('No matching results. Please select from suggestions.');
            return;
        }

        searchType === 'coach'
            ? fetchContractsByCoach(selectedSuggestionId)
            : fetchContractsByTeam(selectedSuggestionId);

        setNoContractsMessage(''); // Clear message when a search is performed
    };

    const fetchContractsByCoach = (coachId) => {
        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/coach-contracts/coach/${coachId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setContractList(response.data);
                setNoContractsMessage(response.data.length === 0 ? 'No contracts found.' : ''); // Set message if no contracts are found
            })
            .catch(error => {
                console.error('Error fetching contracts by coach:', error);
            });
    };

    const fetchContractsByTeam = (teamId) => {
        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/coach-contracts/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setContractList(response.data);
                setNoContractsMessage(response.data.length === 0 ? 'No contracts found.' : ''); // Set message if no contracts are found
            })
            .catch(error => {
                console.error('Error fetching contracts by team:', error);
            });
    };

    const handleContractSelect = (contract) => {
        setSelectedContract(contract);
        setStartDate(contract.startDate);
        setEndDate(contract.endDate);
        setSalary(contract.salary);
        setTransferFee(contract.transferFee);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        const updatedContractData = {
            startDate,
            endDate,
            salary,
            transferFee
        };

        axios.put(`http://localhost:8080/api/coach-contracts/${selectedContract.id}`, updatedContractData, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                alert('Coach contract updated successfully');
                setSelectedContract(null);
                setContractList([]);
            })
            .catch(error => {
                console.error('Error updating contract:', error);
            });
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchQuery('');
        setSuggestions([]);
        setContractList([]);
        setSelectedContract(null);
        setSelectedSuggestionId(null);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search and Edit Coach Contract</h1>

            <Form className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Choose search type:</Form.Label>
                    <Form.Select onChange={handleSearchTypeChange} value={searchType}>
                        <option value="coach">Coach</option>
                        <option value="team">Team</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder={`Enter ${searchType === 'coach' ? 'coach' : 'team'} name`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>

                {suggestions.length > 0 && (
                    <ListGroup className="mb-3">
                        {suggestions.map((item) => (
                            <ListGroup.Item key={item.id} onClick={() => handleSelectSuggestion(item)} style={{ cursor: 'pointer' }}>
                                {searchType === 'coach' ? `${item.firstName} ${item.lastName}` : item.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                )}

                <Button variant="primary" onClick={handleSearch}>Search</Button>
            </Form>

            {contractList.length > 0 ? (
                <div className="mb-4">
                    <h3 className="text-center mb-3">Contracts found:</h3>
                    <Container>
                        {contractList.map(contract => (
                            <Card key={contract.id} className="mb-3 shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center" style={{ textAlign: 'left' }}>
                                    <div>
                                        <strong>ID:</strong> {contract.id}<br />
                                        <strong>Coach:</strong> {contract.coach.firstName} {contract.coach.lastName}<br />
                                        <strong>Team:</strong> {contract.team.name}<br />
                                        <strong>Start Date:</strong> {contract.startDate}<br />
                                        <strong>End Date:</strong> {contract.endDate}<br />
                                        <strong>Salary:</strong> {contract.salary}<br />
                                        <strong>Transfer Fee:</strong> {contract.transferFee}
                                    </div>
                                    <Button variant="outline-primary" onClick={() => handleContractSelect(contract)}>Edit</Button>
                                </Card.Body>
                            </Card>
                        ))}
                    </Container>
                </div>
            ) : (
                <p className="text-center">{noContractsMessage}</p> // Display message if no contracts found
            )}

            {selectedContract && (
                <div className="p-4 border rounded shadow-sm bg-light">
                    <h3 className="text-center mb-4">Edit Contract</h3>
                    <Form onSubmit={handleEditSubmit}>
                        <Form.Group controlId="formStartDate" className="mb-3">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formEndDate" className="mb-3">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                min={startDate}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSalary" className="mb-3">
                            <Form.Label>Salary</Form.Label>
                            <Form.Control
                                type="number"
                                value={salary}
                                onChange={(e) => setSalary(e.target.value)}
                                min="0"
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formTransferFee" className="mb-3">
                            <Form.Label>Transfer Fee</Form.Label>
                            <Form.Control
                                type="number"
                                value={transferFee}
                                onChange={(e) => setTransferFee(e.target.value)}
                                min="0"
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                    </Form>
                </div>
            )}
        </Container>
    );
};

export default EditCoachContractForm;
