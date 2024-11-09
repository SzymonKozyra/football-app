import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NewPasswordModal from './NewPasswordModal';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminPanel = ({ setIsLoggedIn }) => {
    const [users, setUsers] = useState([]);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

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
                    // If the admin is deleting their own account, set the message and log them out after a short delay
                    localStorage.removeItem('jwtToken');
                    setIsLoggedIn(false);
                    localStorage.setItem('logoutOrDeleteAccMessage', 'Your account has been deleted.');
                    setMessageType('success');

                    // Set a delay before navigating to home and reloading the page
                    setTimeout(() => {
                        navigate('/');
                        window.scrollTo(0, 0);
                        window.location.reload();
                    }, 3000); // 3-second delay
                } else {
                    // Update the user list and show success message
                    setUsers(users.filter((user) => user.email !== email));
                    setMessage(`User deleted successfully`);
                    setMessageType('success');

                    // Clear the message after a short delay
                    setTimeout(() => {
                        setMessage('');
                    }, 2000);
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
            setMessage('Password changed successfully');
            setMessageType('success');
            setTimeout(() => {
                setMessage('');
            }, 2000);
            setIsPasswordModalOpen(false);
        } catch (error) {
            console.error('Error changing password:', error);
            setAlert({ show: true, message: 'Failed to change password', variant: 'danger' });
        }
    };

    return (
        <div className="container my-2">
            <h2 className="text-center mb-4">Admin Panel - User Management</h2>

            {/*{alert.show && (*/}
            {/*    <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>*/}
            {/*        {alert.message}*/}
            {/*    </Alert>*/}
            {/*)}*/}
            {message && <Alert variant={messageType}>{message}</Alert>}

            <Table striped bordered hover responsive className="text-center mb-2">
                <thead>
                <tr>
                    <th>Email</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user) => (
                    <tr key={user.email}>
                        <td className="align-middle">{user.email}</td>
                        <td className="align-middle">
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
        </div>
    );
};

export default AdminPanel;
