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
            setMessage('Hasła się nie zgadzają!');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password-confirm', {
                token,
                password
            });
            setMessage('Hasło zostało zmienione.');
            setMessageType('success');
        } catch (error) {
            setMessage('Błąd podczas zmiany hasła. Spróbuj ponownie.');
            setMessageType('error');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Ustaw nowe hasło</h2>
                <form onSubmit={handlePasswordReset}>
                    <div>
                        <label>Nowe hasło:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Potwierdź hasło:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Zmień hasło</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Zamknij</button>
            </div>
        </div>
    );
};

export default NewPasswordModal;
