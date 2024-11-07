import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewPasswordModal from '../components/NewPasswordModal';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Modal, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminView = ({ setIsLoggedIn }) => {
    const [users, setUsers] = useState([]);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
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
                    setAlert({ show: true, message: 'User deleted successfully', variant: 'success' });
                }
            } catch (error) {
                console.error('Error deleting user:', error);
                setAlert({ show: true, message: 'Failed to delete user', variant: 'danger' });
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
            setAlert({ show: true, message: 'Password changed successfully', variant: 'success' });
            setIsPasswordModalOpen(false);
        } catch (error) {
            console.error('Error changing password:', error);
            setAlert({ show: true, message: 'Failed to change password', variant: 'danger' });
        }
    };

    const handleClose = () => {
        navigate('/');
        window.scrollTo(0, 0);
    };

    return (
        <div className="container my-5">
            <h1 className="text-center mb-4">Admin Panel - User Management</h1>

            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}

            <Table striped bordered hover responsive className="text-center">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.email}>
                        <td>{user.email}</td>
                        <td>
                            <Button
                                variant="outline-primary"
                                className="me-2"
                                onClick={() => openPasswordModal(user)}
                            >
                                Change Password
                            </Button>
                            <Button
                                variant="outline-danger"
                                onClick={() => handleDelete(user.email)}
                            >
                                Delete User
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <NewPasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSubmit={(newPassword) => handlePasswordChange(newPassword)}
            />

            <Button variant="secondary" onClick={handleClose} className="mt-3">
                Close
            </Button>
        </div>
    );
};

export default AdminView;
