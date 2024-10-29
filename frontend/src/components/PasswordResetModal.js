import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Modal.css';

const PasswordResetModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
                email
            });
            setMessage('The password reset link has been sent.');
            setMessageType('success');
            setTimeout(() => {
                setMessage('');
                setEmail('');
            }, 2000);
        } catch (error) {
            setMessage('The link could not be sent. Check if the email is correct.');
            setMessageType('error');
        }
    };

    useEffect(() => {
            if (isOpen) {
                setEmail('');
                setMessage('');
                setMessageType('');
            }
        }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Password reset</h2>
                <form onSubmit={handlePasswordReset}>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Send reset link</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default PasswordResetModal;
