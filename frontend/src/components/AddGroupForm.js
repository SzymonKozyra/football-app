import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, ListGroup } from 'react-bootstrap';

const AddGroupForm = () => {
    const [groupName, setGroupName] = useState('');
    const [leagueSearchQuery, setLeagueSearchQuery] = useState('');
    const [filteredLeagues, setFilteredLeagues] = useState([]);
    const [selectedLeague, setSelectedLeague] = useState(null);

    const [teamSearchQuery, setTeamSearchQuery] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);

    // Wyszukiwanie lig
    useEffect(() => {
        if (leagueSearchQuery) {
            if (selectedLeague && leagueSearchQuery !== selectedLeague.name) {
                setSelectedLeague(null);
            }

            const token = localStorage.getItem('jwtToken');
            axios
                .get(`http://localhost:8080/api/leagues/search?query=${leagueSearchQuery}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => setFilteredLeagues(response.data))
                .catch((error) => console.error('Error fetching leagues:', error));
        } else {
            setFilteredLeagues([]);
            setSelectedLeague(null);
        }
    }, [leagueSearchQuery, selectedLeague]);

    // Wyszukiwanie drużyn
    useEffect(() => {
        if (teamSearchQuery) {
            const token = localStorage.getItem('jwtToken');
            axios
                .get(`http://localhost:8080/api/teams/search?query=${teamSearchQuery}`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => {
                    if (Array.isArray(response.data)) {
                        setFilteredTeams(response.data); // Poprawnie przypisz wyniki
                    } else {
                        setFilteredTeams([]);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching teams:', error);
                    setFilteredTeams([]);
                });
        } else {
            setFilteredTeams([]);
        }
    }, [teamSearchQuery]);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        setLeagueSearchQuery(league.name); // Ustaw nazwę ligi w polu wyszukiwania
        setFilteredLeagues([]); // Wyczyść listę wyników
    };

    const handleTeamSelect = (team) => {
        if (!selectedTeams.some((t) => t.id === team.id)) {
            setSelectedTeams([...selectedTeams, team]);
        }
        setTeamSearchQuery('');
        setFilteredTeams([]);
    };

    const handleTeamRemove = (teamId) => {
        setSelectedTeams(selectedTeams.filter((team) => team.id !== teamId));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        try {
            // Dodanie grupy
            const groupResponse = await axios.post(
                'http://localhost:8080/api/leagueGroups/add',
                { name: groupName, leagueId: selectedLeague.id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const groupId = groupResponse.data.id; // Pobieramy ID grupy z odpowiedzi

            // Przygotowanie ID drużyn
            const teamIds = selectedTeams.map((team) => team.id);

            // Przypisanie drużyn do grupy za pomocą poprawnego URL
            await axios.post(
                `http://localhost:8080/api/teamGroupMembership/group/${groupId}/assign`,
                teamIds,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Group and teams added successfully');
            setGroupName('');
            setLeagueSearchQuery('');
            setSelectedLeague(null);
            setSelectedTeams([]);
        } catch (error) {
            console.error('Error adding group or assigning teams:', error);
            alert('Failed to add group or assign teams');
        }
    };


    return (
        <Container className="mt-5">
            <h1 className="text-center mb-4">Add Group</h1>
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <Form.Group controlId="formGroupName" className="mb-3">
                    <Form.Label>Group Name</Form.Label>
                    <Form.Control
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formLeagueSearch" className="mb-3">
                    <Form.Label>League</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search for a league"
                        value={leagueSearchQuery}
                        onChange={(e) => setLeagueSearchQuery(e.target.value)}
                        required
                    />
                    {filteredLeagues.length > 0 && !selectedLeague && (
                        <ListGroup>
                            {filteredLeagues.map((league) => (
                                <ListGroup.Item
                                    key={league.id}
                                    action
                                    onClick={() => handleLeagueSelect(league)}
                                >
                                    {league.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Form.Group>

                <Form.Group controlId="formTeamSearch" className="mb-3">
                    <Form.Label>Teams</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search for a team"
                        value={teamSearchQuery}
                        onChange={(e) => setTeamSearchQuery(e.target.value)}
                    />
                    {filteredTeams.length > 0 && (
                        <ListGroup>
                            {filteredTeams.map((team) => (
                                <ListGroup.Item
                                    key={team.id}
                                    action
                                    onClick={() => handleTeamSelect(team)}
                                >
                                    {team.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                    <ListGroup className="mt-2">
                        {selectedTeams.map((team) => (
                            <ListGroup.Item key={team.id}>
                                {team.name}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    className="float-end"
                                    onClick={() => handleTeamRemove(team.id)}
                                >
                                    Remove
                                </Button>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 mt-3">
                    Add Group
                </Button>
            </Form>
        </Container>
    );
};

export default AddGroupForm;
