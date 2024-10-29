import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

const LoginModal = ({ isOpen, onClose, setIsLoggedIn, setLoginData }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                email,
                password
            });
            console.log(response.data);
            const { token, email: responseEmail } = response.data;
            localStorage.setItem('jwtToken', token);
            const role = response.data.role || 'USER';
            setMessage('Logged in');
            setMessageType('success');
            setIsLoggedIn(true);
            setLoginData({ email: responseEmail, role });
            onClose();
            window.location.reload();
        } catch (error) {
            setMessage('Error while logging in');
            setMessageType('error');
        }
    };

    useEffect(() => {
        setEmail('');
        setPassword('');
        setMessage('');
        setMessageType('');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Login</h2>
                <form onSubmit={handleLogin}>
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
                    <button type="submit">Login</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default LoginModal;
