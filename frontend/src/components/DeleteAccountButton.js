import React from 'react';
import axios from 'axios';

const DeleteAccountButton = ({ setIsLoggedIn, setMessage }) => {

    const handleDeleteAccount = async () => {
        if (window.confirm('Czy na pewno chcesz usunąć swoje konto?')) {
            try {
                const token = localStorage.getItem('jwtToken');
                await axios.delete('http://localhost:8080/api/auth/delete-account', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                localStorage.removeItem('jwtToken');
                setIsLoggedIn(false);
                setMessage('Konto zostało usunięte.');
                setTimeout(() => setMessage(''), 3000);
            } catch (error) {
                setMessage('Wystąpił problem z usunięciem konta.');
            }
        }
    };

    return (
        <div>
            <button onClick={handleDeleteAccount} className="navbar-btn">Usuń konto</button>
        </div>
    );
};

export default DeleteAccountButton;
