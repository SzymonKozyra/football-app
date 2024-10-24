import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './AdminPanel.css';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);

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
        try {
            await axios.delete(`http://localhost:8080/api/admin/delete-user/${email}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            setUsers(users.filter((user) => user.email !== email));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleChangePassword = async (email, newPassword) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/change-password/${email}`, { newPassword }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('jwtToken')}` },
            });
            alert('Password changed successfully');
        } catch (error) {
            console.error('Error changing password:', error);
        }
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
                                onClick={() => handleChangePassword(user.email)}
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
        </div>
    );
};

export default AdminPanel;