import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

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
        <div>
            <h2>Admin Panel - User Management</h2>
            <table>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Change Password</th>
                    <th>Delete User</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.email}>
                        <td>{user.email}</td>
                        <td>
                            <Link to="#" onClick={() => handleChangePassword(user.email, prompt('Enter new password'))}>
                                Change Password
                            </Link>
                        </td>
                        <td>
                            <Link to="#" onClick={() => handleDelete(user.email)}>Delete User</Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPanel;
