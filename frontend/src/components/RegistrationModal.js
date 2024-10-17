import React, { useState, useEffect } from 'react';
import './Modal.css';
import axios from "axios";

const RegistrationModal = ({ isOpen, onClose, onOpenLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();

        // Walidacja hasła
        if (password.length < 1) {
            setMessage('Hasło musi zawierać co najmniej 8 znaków.');
            return;
        }

        if (password !== confirmPassword) {
            setMessage('Hasła muszą być identyczne.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/auth/register', {
                username,
                email,
                password
            });
            setMessage(response.data);
        } catch (error) {
            setMessage('Błąd podczas rejestracji. Użytkownik już istnieje lub inne błędy.');
        }
    };

    useEffect(() => {
            if (isOpen) {
                setUsername('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setMessage('');
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
                {message && <p>{message}</p>}
                <button onClick={onClose}>Zamknij</button>
                <p>
                    Masz już konto?{' '}
                    <a href="#" onClick={() => {
                        onClose(); // Zamknij modal rejestracji
                        onOpenLogin(); // Otwórz modal logowania
                    }}>
                        Zaloguj się
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegistrationModal;
