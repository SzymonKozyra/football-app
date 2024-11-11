import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Form, ListGroup, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const EditPlayerContractForm = () => {
    const [searchType, setSearchType] = useState('player');
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestionId, setSelectedSuggestionId] = useState(null);
    const [contractList, setContractList] = useState([]);
    const [selectedContractId, setSelectedContractId] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salary, setSalary] = useState('');
    const [transferFee, setTransferFee] = useState('');
    const [transferType, setTransferType] = useState('');
    const [noContractsMessage, setNoContractsMessage] = useState('');

    useEffect(() => {
        if (searchQuery) {
            const token = localStorage.getItem('jwtToken');
            const url = searchType === 'player'
                ? `http://localhost:8080/api/players/search?query=${searchQuery}`
                : `http://localhost:8080/api/teams/search?query=${searchQuery}`;

            axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            })
                .then(response => setSuggestions(response.data))
                .catch(error => {
                    console.error('Error fetching suggestions:', error);
                    setNoContractsMessage('Failed to load suggestions.');
                });
        } else {
            setSuggestions([]);
        }
    }, [searchQuery, searchType]);

    const handleSelectSuggestion = (item) => {
        setSearchQuery(searchType === 'player' ? `${item.firstName} ${item.lastName}` : item.name);
        setSelectedSuggestionId(item.id);
        setSuggestions([]);
    };

    const handleSearch = () => {
        if (!selectedSuggestionId) {
            setNoContractsMessage('No matching results. Please select from suggestions.');
            return;
        }

        searchType === 'player'
            ? fetchContractsByPlayer(selectedSuggestionId)
            : fetchContractsByTeam(selectedSuggestionId);

        setNoContractsMessage('');
    };

    const fetchContractsByPlayer = (playerId) => {
        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/player-contracts/player/${playerId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setContractList(response.data);
                setNoContractsMessage(response.data.length === 0 ? 'No contracts found.' : '');
            })
            .catch(error => {
                console.error('Error fetching player contracts:', error);
                setNoContractsMessage('Failed to load player contracts.');
            });
    };

    const fetchContractsByTeam = (teamId) => {
        const token = localStorage.getItem('jwtToken');
        axios.get(`http://localhost:8080/api/player-contracts/team/${teamId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(response => {
                setContractList(response.data);
                setNoContractsMessage(response.data.length === 0 ? 'No contracts found.' : '');
            })
            .catch(error => {
                console.error('Error fetching team contracts:', error);
                setNoContractsMessage('Failed to load team contracts.');
            });
    };

    const handleContractSelect = (contract) => {
        setSelectedContractId(contract.id);
        setStartDate(contract.startDate);
        setEndDate(contract.endDate);
        setSalary(contract.salary);
        setTransferFee(contract.transferFee);
        setTransferType(contract.transferType);
    };

    const handleEditSubmit = (e) => {
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
                alert('Player contract updated successfully');
                setSelectedContractId(null);
                setContractList([]);
            })
            .catch(error => {
                console.error('Error updating contract:', error);
                setNoContractsMessage('An error occurred while updating the contract.');
            });
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.target.value);
        setSearchQuery('');
        setSuggestions([]);
        setContractList([]);
        setSelectedContractId(null);
        setSelectedSuggestionId(null);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Search and Edit Player Contract</h1>

            <Form className="mb-4">
                <Form.Group className="mb-3">
                    <Form.Label>Choose search type:</Form.Label>
                    <Form.Select onChange={handleSearchTypeChange} value={searchType}>
                        <option value="player">Player</option>
                        <option value="team">Team</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder={`Enter ${searchType === 'player' ? 'player' : 'team'} name`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>

                {suggestions.length > 0 && (
                    <ListGroup className="mb-3">
                        {suggestions.map((item) => (
                            <ListGroup.Item key={item.id} onClick={() => handleSelectSuggestion(item)} style={{ cursor: 'pointer' }}>
                                {searchType === 'player' ? `${item.firstName} ${item.lastName}` : item.name}
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
                            <React.Fragment key={contract.id}>
                                <Card className="mb-3 shadow-sm">
                                    <Card.Body className="d-flex justify-content-between align-items-center" style={{ textAlign: 'left' }}>
                                        <div>
                                            <strong>Player:</strong> {contract.player.firstName} {contract.player.lastName}<br />
                                            <strong>Team:</strong> {contract.team.name}<br />
                                            <strong>Start Date:</strong> {contract.startDate}<br />
                                            <strong>End Date:</strong> {contract.endDate}<br />
                                            <strong>Salary:</strong> {contract.salary}<br />
                                            <strong>Transfer Type:</strong> {contract.transferType}<br />
                                            {contract.transferType === "TRANSFER" && (
                                                <>
                                                    <strong>Transfer Fee:</strong> {contract.transferFee}
                                                </>
                                            )}
                                        </div>
                                        <Button variant="outline-primary" onClick={() => handleContractSelect(contract)}>Edit</Button>
                                    </Card.Body>
                                </Card>

                                {selectedContractId === contract.id && (
                                    <div className="p-4 border rounded shadow-sm bg-light mb-3">
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
                                            <Form.Group controlId="formTransferType" className="mb-3">
                                                <Form.Label>Transfer Type</Form.Label>
                                                <Form.Select value={transferType} onChange={(e) => setTransferType(e.target.value)} required>
                                                    <option value="">Select transfer type</option>
                                                    <option value="LOAN">Loan</option>
                                                    <option value="TRANSFER">Transfer</option>
                                                    <option value="END_LOAN">End of Loan</option>
                                                </Form.Select>
                                            </Form.Group>
                                            {transferType === "TRANSFER" && (
                                                <Form.Group controlId="formTransferFee" className="mb-3">
                                                    <Form.Label>Transfer Fee</Form.Label>
                                                    <Form.Control
                                                        type="number"
                                                        value={transferFee}
                                                        onChange={(e) => setTransferFee(e.target.value)}
                                                        min="0"
                                                        required
                                                    />
                                                </Form.Group>
                                            )}
                                            <Button variant="primary" type="submit" className="w-100">Save Changes</Button>
                                        </Form>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </Container>
                </div>
            ) : (
                <p className="text-center">{noContractsMessage}</p>
            )}
        </Container>
    );
};

export default EditPlayerContractForm;
