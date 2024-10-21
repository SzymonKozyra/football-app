import React, { useState } from 'react';
import axios from 'axios';

const AddModeratorForm = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState(''); // New state for username
    const [message, setMessage] = useState('');

    const handleAddModerator = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.log('Authorization token is missing');
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:8080/api/admin/add-moderator',
                { email, password, username },  // Include username in the request body
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Moderator added successfully');
        } catch (error) {
            // Log the actual error from the backend
            console.error('Error adding moderator:', error.response?.data || error.message);
            setMessage(`Failed to add moderator: ${error.response?.data || 'Unknown error'}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Dodaj Moderator</h2>
                <form onSubmit={handleAddModerator}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Username:</label> {/* New input field for username */}
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Hasło:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Dodaj Moderator</button>
                </form>
                {message && <p>{message}</p>}
                <button onClick={onClose}>Zamknij</button>
            </div>
        </div>
    );
};

export default AddModeratorForm;