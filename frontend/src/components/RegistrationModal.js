import React, { useState, useEffect } from 'react';
import './Modal.css';
import axios from "axios";

const RegistrationModal = ({ isOpen, onClose, onOpenLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password.length < 12) {
            setMessage('The password must contain at least 8 characters.');
            setMessageType('error');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Passwords must be identical.');
            setMessageType('error');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                email,
                password
            });
            setMessage(response.data);
            setMessageType('success');
        } catch (error) {
            setMessage('Registration error. User already exists or other errors.');
            setMessageType('error');
        }
    };

    useEffect(() => {
        if (isOpen) {
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setMessage('');
            setMessageType('');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Registration</h2>
                <form onSubmit={handleRegister}>
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
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                    <div>
                        <label>Confirm password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Register</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Close</button>
                <p className="blue-text">
                    Already have an account?{' '}
                    <a href="#" onClick={() => {
                        onClose();
                        onOpenLogin();
                    }} className="login-link">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegistrationModal;
