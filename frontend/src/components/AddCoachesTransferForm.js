//import React, { useState, useEffect } from 'react';
//import axios from 'axios';
//import '../App.css';
//
//const AddCoachesTransferForm = () => {
//    const [searchQuery, setSearchQuery] = useState('');
//    const [filteredCoaches, setFilteredCoaches] = useState([]);
//    const [coaches, setCoaches] = useState([]);
//    const [coachId, setCoachId] = useState('');
//    const [previousClub, setPreviousClub] = useState('');
//    const [destinationClub, setDestinationClub] = useState('');
//    const [transferDate, setTransferDate] = useState('');
//    const [transferValue, setTransferValue] = useState('');
//
////    useEffect(() => {
////        axios.get('http://localhost:8080/api/coaches')
////            .then(response => setCoaches(response.data))
////            .catch(error => console.error("Error fetching coaches:", error));
////    }, []);
//    useEffect(() => {
//        if (coachSearchTerm) {
//            axios.get(`http://localhost:8080/api/coaches/search?query=${coachSearchTerm}`)
//                .then(response => setFilteredCoaches(response.data))
//                .catch(error => console.error('Error fetching coaches:', error));
//        } else {
//            setFilteredCoaches([]);
//        }
//    }, [coachSearchTerm]);
//
//
//    const resetForm = () => {
//        setCoachId('');
//        setPreviousClub('');
//        setDestinationClub('');
//        setTransferDate('');
//        setTransferValue('');
//    };
//
//
//    const handleSubmit = (e) => {
//        e.preventDefault();
//
//        //
//        if (!coachId || !previousClub || !destinationClub || !transferDate || transferValue <= 0) {
//                alert('Please fill in all fields correctly');
//                return;
//        }
//        //
//
//        const transferData = {
//            coachId,
//            previousClub,
//            destinationClub,
//            transferDate,
//            value: transferValue
//        };
//
//        axios.post('http://localhost:8080/api/coaches-transfers/add', transferData)
//            .then(response => {
//                alert('Transfer added successfully');
//                resetForm();
//            })
//            .catch(error => {
//                console.error('Error adding transfer:', error);
//                alert('Failed to add transfer');
//            });
//    };
//
//    return (
//        <form onSubmit={handleSubmit} className="form-container">
//            <h1>Add CoachesTransfer</h1>
//
//            <div>
//                <label>Coach</label>
//                <select value={coachId} onChange={(e) => setCoachId(e.target.value)} required>
//                    <option value="">Select Coach</option>
//                    {coaches.map(coach => (
//                        <option key={coach.id} value={coach.id}>
//                            {coach.firstName} {coach.lastName}
//                        </option>
//                    ))}
//                </select>
//            </div>
//
//            <div>
//                <label>Previous Club</label>
//                <input
//                    type="text"
//                    value={previousClub}
//                    onChange={(e) => setPreviousClub(e.target.value)}
//                    required
//                />
//            </div>
//
//            <div>
//                <label>Destination Club</label>
//                <input
//                    type="text"
//                    value={destinationClub}
//                    onChange={(e) => setDestinationClub(e.target.value)}
//                    required
//                />
//            </div>
//
//            <div>
//                <label>Transfer Date</label>
//                <input
//                    type="date"
//                    value={transferDate}
//                    onChange={(e) => setTransferDate(e.target.value)}
//                    required
//                />
//            </div>
//
//            <div>
//                <label>Transfer Value</label>
//                <input
//                    type="number"
//                    value={transferValue}
//                    onChange={(e) => setTransferValue(e.target.value)}
//                    min="1"
//                    required
//                />
//            </div>
//
//            <button type="submit">Add Transfer</button>
//        </form>
//    );
//};
//
//export default AddCoachesTransferForm;







import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddCoachesTransferForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredCoaches, setFilteredCoaches] = useState([]);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [previousClub, setPreviousClub] = useState('');
    const [destinationClub, setDestinationClub] = useState('');
    const [transferDate, setTransferDate] = useState('');
    const [transferValue, setTransferValue] = useState('');


    //WYBIERANIE KLUBÓW
    //////////////////////////////////////////////////////////////
    const [previousClubSearchQuery, setPreviousClubSearchQuery] = useState('');
    const [destinationClubSearchQuery, setDestinationClubSearchQuery] = useState('');
    const [filteredPreviousClubs, setFilteredPreviousClubs] = useState([]);
    const [filteredDestinationClubs, setFilteredDestinationClubs] = useState([]);


    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (previousClubSearchQuery && token) {
            axios.get(`http://localhost:8080/api/teams/search?query=${previousClubSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredPreviousClubs(response.data))
            .catch(error => console.error('Error fetching previous clubs:', error));
        } else {
            setFilteredPreviousClubs([]);
        }
    }, [previousClubSearchQuery]);

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (destinationClubSearchQuery && token) {
            axios.get(`http://localhost:8080/api/teams/search?query=${destinationClubSearchQuery}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setFilteredDestinationClubs(response.data))
            .catch(error => console.error('Error fetching destination clubs:', error));
        } else {
            setFilteredDestinationClubs([]);
        }
    }, [destinationClubSearchQuery]);


    const handlePreviousClubSelect = (club) => {
        setPreviousClub(club.name);
        setPreviousClubSearchQuery(club.name);
        setFilteredPreviousClubs([]);
    };

    const handleDestinationClubSelect = (club) => {
        setDestinationClub(club.name);
        setDestinationClubSearchQuery(club.name);
        setFilteredDestinationClubs([]);
    };
    //////////////////////////////////////////////////////////////


    // Funkcja do pobierania dzisiejszej daty w formacie YYYY-MM-DD
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Dodaje zero przed jednocyfrowym miesiącem
        const day = String(today.getDate()).padStart(2, '0'); // Dodaje zero przed jednocyfrowym dniem
        return `${year}-${month}-${day}`;
    };

    // Wyszukiwanie trenerów na podstawie frazy
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

    const handleCoachSelect = (coach) => {
        setSelectedCoach(coach);
        setSearchQuery(`${coach.firstName} ${coach.lastName}`);
        setFilteredCoaches([]);
    };

    const resetForm = () => {
        setSelectedCoach(null);
        setPreviousClub('');
        setDestinationClub('');
        setTransferDate('');
        setTransferValue('');
        setSearchQuery('');
        setFilteredCoaches([]);

        setPreviousClubSearchQuery('');
        setDestinationClubSearchQuery('');
        setFilteredPreviousClubs([]);
        setFilteredDestinationClubs([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');

        if (!selectedCoach || !previousClub || !destinationClub || !transferDate || transferValue < 0) {
            alert('Please fill in all fields correctly');
            return;
        }

        const transferData = {
            coachId: selectedCoach.id,
            previousClub,
            destinationClub,
            transferDate,
            value: transferValue
        };

        axios.post('http://localhost:8080/api/coaches-transfers/add', transferData, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            alert('Transfer added successfully');
            resetForm();
        })
        .catch(error => {
            console.error('Error adding transfer:', error);
            alert('Failed to add transfer');
        });
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>Add Coaches Transfer</h1>

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
                <label>Previous Club</label>
                <input
                    type="text"
                    value={previousClubSearchQuery}
                    onChange={(e) => setPreviousClubSearchQuery(e.target.value)}
                    placeholder="Search for a previous club"
                />
                {filteredPreviousClubs.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredPreviousClubs.map((club) => (
                            <li
                                key={club.id}
                                onClick={() => handlePreviousClubSelect(club)}
                                style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}
                            >
                                {club.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label>Destination Club</label>
                <input
                    type="text"
                    value={destinationClubSearchQuery}
                    onChange={(e) => setDestinationClubSearchQuery(e.target.value)}
                    placeholder="Search for a destination club"
                />
                {filteredDestinationClubs.length > 0 && (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {filteredDestinationClubs.map((club) => (
                            <li
                                key={club.id}
                                onClick={() => handleDestinationClubSelect(club)}
                                style={{ cursor: 'pointer', padding: '5px', borderBottom: '1px solid #ccc' }}
                            >
                                {club.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>



            <div>
                <label>Transfer Date</label>
                <input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    max={getTodayDate()} // Ustawienie maksymalnej daty na dzisiaj
                    required
                />
            </div>

            <div>
                <label>Transfer Value</label>
                <input
                    type="number"
                    value={transferValue}
                    onChange={(e) => setTransferValue(e.target.value)}
                    min="0"
                    required
                />
            </div>

            <button type="submit">Add Transfer</button>
        </form>
    );
};

export default AddCoachesTransferForm;
