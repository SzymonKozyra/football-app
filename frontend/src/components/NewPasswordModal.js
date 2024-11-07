import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const NewPasswordModal = ({ isOpen, onClose, onSubmit }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    const handlePasswordReset = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage('Passwords do not match.');
            setMessageType('danger');
            return;
        }

        onSubmit(password);
        setMessage('Password has been successfully changed.');
        setMessageType('success');

        // Reset fields after a short delay
        // setTimeout(() => {
        //     setPassword('');
        //     setConfirmPassword('');
        //     setMessage('');
        //     onClose();
        // }, 4000);
    };

    return (
        <Modal show={isOpen} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Set New Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handlePasswordReset}>
                    <Form.Group controlId="formPassword">
                        <Form.Label>New Password:</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formConfirmPassword" className="mt-3">
                        <Form.Label>Confirm Password:</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {message && <p className={`text-${messageType} mt-2`}>{message}</p>}
                    <Button variant="primary" type="submit" className="mt-3 w-100">
                        Change Password
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default NewPasswordModal;
