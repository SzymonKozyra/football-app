import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

const AddModeratorForm = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

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
                { email, password, username },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Moderator added successfully');
            setMessageType('success');

        } catch (error) {
            // Log the actual error from the backend
            console.error('Error adding moderator:', error.response?.data || error.message);
            setMessage(`Failed to add moderator: ${error.response?.data || 'Unknown error'}`);
        }
    };
    const handleAddAdmin = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.log('Authorization token is missing');
            return;
        }
        try {
            const response = await axios.post(
                'http://localhost:8080/api/admin/add-admin',
                { email, password, username },  // Include username in the request body
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Admin added successfully');
        } catch (error) {
            // Log the actual error from the backend
            console.error('Error adding admin:', error.response?.data || error.message);
            setMessage(`Failed to add admin: ${error.response?.data || 'Unknown error'}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add Account</h2>
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
                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Add Moderator</button>
                    <button type="submit">Dodaj moderatora</button>
                </form>
                <form onSubmit={handleAddAdmin}>
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
                    <button type="submit">Dodaj admina</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddModeratorForm;