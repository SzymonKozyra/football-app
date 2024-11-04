import React, { useState } from 'react';
import './Modal.css';

const NewPasswordModal = ({ isOpen, onClose, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handlePasswordReset = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords are not the same!');
            setMessageType('error');
            return;
        }

        onSubmit(password);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Set New Password</h2>
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
                    <button type="submit">Change Password</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default NewPasswordModal;
