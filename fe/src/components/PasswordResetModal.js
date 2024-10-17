import React, { useState } from 'react';
import axios from 'axios';
import './Modal.css';

const PasswordResetModal = ({ isOpen, onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password', {
                email
            });
            setMessage('Link do resetowania hasła został wysłany.');
        } catch (error) {
            setMessage('Nie udało się wysłać linku. Sprawdź email.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Resetowanie Hasła</h2>
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
                    <button type="submit">Wyślij link do resetu</button>
                </form>
                {message && <p>{message}</p>}
                <button onClick={onClose}>Zamknij</button>
            </div>
        </div>
    );
};

export default PasswordResetModal;
