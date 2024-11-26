import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const RegisterAdminForm = () => {
    const [adminData, setAdminData] = useState({ email: '', username: '', password: '' });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/auth/register-admin', adminData)
            .then(() => {
                setMessage('Admin account created successfully.');
                setMessageType('success');
                setTimeout(() => {
                    window.location.href = "/login";
                }, 3000);
            })
            .catch(error => {
                setMessage(error.response?.data || 'An error occurred');
                setMessageType('error');
            });
    };



    return (
        <Container className="mt-5">
            {message && (
                <Alert variant={messageType === 'success' ? 'success' : 'danger'} dismissible
                       onClose={() => setMessage('')}>
                    {message}
                </Alert>
            )}
            <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">
                <h1 className="text-center mb-4">Register Admin</h1>
                <Form.Group controlId="formEmail" className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Enter email"
                        value={adminData.email}
                        onChange={(e) => setAdminData({...adminData, email: e.target.value})}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formUsername" className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter username"
                        value={adminData.username}
                        onChange={(e) => setAdminData({...adminData, username: e.target.value})}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="formPassword" className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        value={adminData.password}
                        onChange={(e) => setAdminData({...adminData, password: e.target.value})}
                        required
                    />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                    Create Admin
                </Button>
            </Form>
        </Container>
    );
};

export default RegisterAdminForm;
