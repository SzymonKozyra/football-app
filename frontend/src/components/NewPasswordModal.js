import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

const NewPasswordModal = ({ isOpen, onClose, token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords are not the same!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password-confirm', {
                token,
                password
            });
            setMessage('The password has been changed.');
            setMessageType('success');
        } catch (error) {
            setMessage('Error when changing password. Please try again.');
            setMessageType('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Set new password</h2>
                <form onSubmit={handlePasswordReset}>
                    <div>
                        <label>New password:</label>
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
                    <button type="submit">Change password</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default NewPasswordModal;
