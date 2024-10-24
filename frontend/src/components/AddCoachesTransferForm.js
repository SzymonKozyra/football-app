import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const AddCoachesTransferForm = () => {
    const [coaches, setCoaches] = useState([]);
    const [coachId, setCoachId] = useState('');
    const [previousClub, setPreviousClub] = useState('');
    const [destinationClub, setDestinationClub] = useState('');
    const [transferDate, setTransferDate] = useState('');
    const [transferValue, setTransferValue] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8080/api/coaches')
            .then(response => setCoaches(response.data))
            .catch(error => console.error("Error fetching coaches:", error));
    }, []);


    const resetForm = () => {
        setCoachId('');
        setPreviousClub('');
        setDestinationClub('');
        setTransferDate('');
        setTransferValue('');
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        //
        if (!coachId || !previousClub || !destinationClub || !transferDate || transferValue <= 0) {
                alert('Please fill in all fields correctly');
                return;
        }
        //

        const transferData = {
            coachId,
            previousClub,
            destinationClub,
            transferDate,
            value: transferValue
        };

        axios.post('http://localhost:8080/api/coaches-transfers/add', transferData)
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
            <h1>Add CoachesTransfer</h1>

            <div>
                <label>Coach</label>
                <select value={coachId} onChange={(e) => setCoachId(e.target.value)} required>
                    <option value="">Select Coach</option>
                    {coaches.map(coach => (
                        <option key={coach.id} value={coach.id}>
                            {coach.firstName} {coach.lastName}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label>Previous Club</label>
                <input
                    type="text"
                    value={previousClub}
                    onChange={(e) => setPreviousClub(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Destination Club</label>
                <input
                    type="text"
                    value={destinationClub}
                    onChange={(e) => setDestinationClub(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Transfer Date</label>
                <input
                    type="date"
                    value={transferDate}
                    onChange={(e) => setTransferDate(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Transfer Value</label>
                <input
                    type="number"
                    value={transferValue}
                    onChange={(e) => setTransferValue(e.target.value)}
                    min="1"
                    required
                />
            </div>

            <button type="submit">Add Transfer</button>
        </form>
    );
};

export default AddCoachesTransferForm;
