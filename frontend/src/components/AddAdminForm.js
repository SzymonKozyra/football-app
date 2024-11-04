// AddAdminForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

const AddAdminForm = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

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
                { email, password, username },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Admin added successfully');
            setMessageType('success');
            setTimeout(() => {
                setMessage('');
                setEmail('');
                setPassword('');
                setUsername('');
            }, 2000);
        } catch (error) {
            console.error('Error adding admin:', error.response?.data || error.message);
            setMessage(`Failed to add admin: ${error.response?.data || 'Unknown error'}`);
            setMessageType('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Add Admin</h2>
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
                        <label>Username:</label>
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
                    <button type="submit">Add Admin</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default AddAdminForm;
