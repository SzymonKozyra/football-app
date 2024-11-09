//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import '../App.css';
//
//const AddCoachContractForm = () => {
//    const [coachId, setCoachId] = useState('');
//    const [teamId, setTeamId] = useState('');
//    const [startDate, setStartDate] = useState('');
//    const [endDate, setEndDate] = useState('');
//    const [salary, setSalary] = useState('');
//    const [transferFee, setTransferFee] = useState('');
//    const [coaches, setCoaches] = useState([]);
//    const [teams, setTeams] = useState([]);
//
//    useEffect(() => {
//        axios.get('/api/coaches').then(res => setCoaches(res.data));
//        axios.get('/api/teams').then(res => setTeams(res.data));
//    }, []);
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//        const token = localStorage.getItem('jwtToken');
//        const contractData = { coachId, teamId, startDate, endDate, salary, transferFee };
//        axios.post('/api/coach-contracts/add', contractData, {
//            headers: { Authorization: `Bearer ${token}` }
//        }).then(() => {
//            alert("Coach contract added successfully");
//        }).catch(err => {
//            console.error("Failed to add coach contract:", err);
//            alert("Failed to add coach contract");
//        });
//    };
//
//    return (
//        <form onSubmit={handleSubmit}>
//            <h1>Add Coach Contract</h1>
//            {/* Form fields for startDate, endDate, salary, transferFee */}
//            {/* Dropdowns for selecting coach and team */}
//            <button type="submit">Add Contract</button>
//        </form>
//    );
//};
//
//export default AddCoachContractForm;



import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddCoachContractForm = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [salary, setSalary] = useState('');
    const [transferFee, setTransferFee] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [teamSearchQuery, setTeamSearchQuery] = useState('');
    const [filteredTeams, setFilteredTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (searchQuery && token) {
            axios.get(`http://localhost:8080/api/coaches/search?query=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredCoaches(response.data))
            .catch(error => console.error('Error fetching coaches:', error));
        } else {
            setFilteredCoaches([]);
        }
    }, [searchQuery]);

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


    const handleCoachSelect = (coach) => {
        setSelectedCoach(coach);
        setSearchQuery(`${coach.firstName} ${coach.lastName}`);
        setFilteredCoaches([]);
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
            transferFee,
            coachId: selectedCoach ? selectedCoach.id : null,
            teamId: selectedTeam ? selectedTeam.id : null
        };

        axios.post('http://localhost:8080/api/coach-contracts/add', contractData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Coach contract added successfully');
            // Reset form fields after successful submission
            setStartDate('');
            setEndDate('');
            setSalary('');
            setTransferFee('');
            setSelectedCoach(null);
            setSearchQuery('');
            setSelectedTeam(null);
            setTeamSearchQuery('');
        })
        .catch(error => console.error('Error adding contract:', error));

    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Add Coach Contract</h1>

            <div>
                <label>Search Coach</label>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for a coach"
                />
                {filteredCoaches.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredCoaches.map((coach) => (
                            <li
                                key={coach.id}
                                onClick={() => handleCoachSelect(coach)}
                                style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}
                            >
                                {coach.firstName} {coach.lastName} ({coach.nickname})
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
                <label>Transfer Fee</label>
                <input
                    type="number"
                    value={transferFee}
                    onChange={(e) => setTransferFee(e.target.value)}
                    min="0"
                    required
                />
            </div>

            <button type="submit">Add Contract</button>
        </form>
    );
};

export default AddCoachContractForm;
