import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewPasswordModal from './NewPasswordModal';
import './AdminPanel.css';
import { useNavigate } from 'react-router-dom';

const AdminPanel = ({ setIsLoggedIn }) => {
    const [users, setUsers] = useState([]);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/admin/users', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (email) => {
        const loggedInEmail = localStorage.getItem('email');

        if (window.confirm(`Do you really want to delete "${email}" account?`)) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/delete-user/${email}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
                });

                if (email === loggedInEmail) {
                    localStorage.removeItem('jwtToken');
                    setIsLoggedIn(false);
                    localStorage.setItem('logoutOrDeleteAccMessage', 'Your account has been deleted.');
                    navigate('/');
                    window.scrollTo(0, 0);
                    window.location.reload();
                } else {
                    setUsers(users.filter((user) => user.email !== email));
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };


    const openPasswordModal = (user) => {
        setSelectedUser(user);
        setIsPasswordModalOpen(true);
    };

    const handlePasswordChange = async (newPassword) => {
        try {
            await axios.put(
                `http://localhost:8080/api/admin/change-password/${selectedUser.email}`,
                newPassword,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                        'Content-Type': 'text/plain'
                    },
                }
            );
            alert('Password changed successfully');
            setIsPasswordModalOpen(false);
        } catch (error) {
            console.error('Error changing password:', error);
            alert('Failed to change password');
        }
    };

    const handleClose = () => {
        navigate('/');
        window.scrollTo(0, 0);
    };


    return (
        <div className="admin-panel-container">
            <h1 className="admin-panel-title">Admin Panel - User Management</h1>
            <table className="admin-panel-table">
                <tbody>
                {users.map((user) => (
                    <tr key={user.email}>
                        <td>{user.email}</td>
                        <td>
                            <button
                                className="action-btn"
                                onClick={() => openPasswordModal(user)}
                            >
                                Change Password
                            </button>
                        </td>
                        <td>
                            <button
                                className="action-btn delete-btn"
                                onClick={() => handleDelete(user.email)}
                            >
                                Delete User
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {isPasswordModalOpen && (
                <NewPasswordModal
                    isOpen={isPasswordModalOpen}
                    onClose={() => setIsPasswordModalOpen(false)}
                    onSubmit={(newPassword) => handlePasswordChange(newPassword)}
                />
            )}

            <button onClick={handleClose} className="close-btn">
                Close
            </button>
        </div>
    );
};

export default AdminPanel;
