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

        if (password.length < 1) {
            setMessage('Hasło musi zawierać co najmniej 8 znaków.');
            setMessageType('error');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Hasła muszą być identyczne.');
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
            setMessage('Błąd podczas rejestracji. Użytkownik już istnieje lub inne błędy.');
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
                <h2>Rejestracja</h2>
                <form onSubmit={handleRegister}>
                    <div>
                        <label>Nazwa użytkownika:</label>
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
                        <label>Hasło:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Powtórz hasło:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Zarejestruj się</button>
                </form>
                {message && <p className={`message ${messageType}`}>{message}</p>}
                <button onClick={onClose}>Zamknij</button>
                <p className="blue-text">
                    Masz już konto?{' '}
                    <a href="#" onClick={() => {
                        onClose();
                        onOpenLogin();
                    }} className="login-link">
                        Zaloguj się
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegistrationModal;
