import React from 'react';
import axios from 'axios';

const DeleteAccountButton = ({ setIsLoggedIn, setMessage }) => {

    const handleDeleteAccount = async () => {
        if (window.confirm('Do you really want to delete your account?')) {
            try {
                const token = localStorage.getItem('jwtToken');
                await axios.delete('http://localhost:8080/api/auth/delete-account', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                localStorage.removeItem('jwtToken');
                setIsLoggedIn(false);
                localStorage.setItem('logoutOrDeleteAccMessage', 'The account has been deleted.');
                window.location.reload();
            } catch (error) {
                setMessage('There was a problem deleting the account.');
            }
        }
    };

    return (
        <div>
            <button onClick={handleDeleteAccount} className="navbar-btn">Delete account</button>
        </div>
    );
};

export default DeleteAccountButton;
