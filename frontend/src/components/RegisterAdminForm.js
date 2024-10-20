import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RegisterAdminForm = () => {
    const [adminExists, setAdminExists] = useState(false);
    const [adminData, setAdminData] = useState({ email: '', username: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Sprawdź, czy konto admina już istnieje
        axios.get('http://localhost:8080/api/auth/check-admin')
            .then(response => setAdminExists(response.data))
            .catch(error => console.error('Error checking admin existence:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/auth/register-admin', adminData)
            .then(() => {
                alert('Admin account created successfully.');
                window.location.href = "/login";  // Przekierowanie na stronę logowania
            })
            .catch(error => {
                setErrorMessage(error.response.data);
            });
    };

    // Jeśli konto admina istnieje, przekieruj na stronę logowania
    if (adminExists) {
        return <div>Admin account already exists. Please log in.</div>;
    }

    return (
        <div>
            <h1>Create Admin Account</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={adminData.email}
                        onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Username</label>
                    <input
                        type="text"
                        value={adminData.username}
                        onChange={(e) => setAdminData({ ...adminData, username: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={adminData.password}
                        onChange={(e) => setAdminData({ ...adminData, password: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Create Admin</button>
            </form>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default RegisterAdminForm;
