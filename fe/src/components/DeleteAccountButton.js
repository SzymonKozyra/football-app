import React, { useState } from 'react';
import axios from 'axios';

const DeleteAccountButton = ({ onAccountDeleted }) => {
    const [message, setMessage] = useState('');

    const handleDeleteAccount = async () => {
        if (window.confirm('Czy na pewno chcesz usunąć swoje konto?')) {
            try {
                // Retrieve the JWT token from localStorage
                const token = localStorage.getItem('jwtToken');

                // Send DELETE request to delete the account with Authorization header
                const response = await axios.delete('http://localhost:8080/api/auth/delete-account', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
                    },
                });

                setMessage('Konto zostało usunięte.');

                // Call the function passed through props to handle logout after account deletion
                onAccountDeleted();
            } catch (error) {
                setMessage('Wystąpił problem z usunięciem konta.');
            }
        }
    };

    return (
        <div>
            <button onClick={handleDeleteAccount}>Usuń konto</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DeleteAccountButton;
