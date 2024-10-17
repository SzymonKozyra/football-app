import React, { useEffect, useState } from 'react';
import RegistrationModal from './components/RegistrationModal';
import LoginModal from './components/LoginModal';
import PasswordResetModal from './components/PasswordResetModal';
import NewPasswordModal from './components/NewPasswordModal';
import AddModeratorForm from './components/AddModeratorForm';
import DeleteAccountButton from './components/DeleteAccountButton'; // Zostawiamy import
import { useLocation, Link, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import AddStadiumForm from './components/AddStadiumForm';
import Navbar from './components/Navbar';
import './components/Navbar.css';
import axios from 'axios';

function App() {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', role: '' });
    const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
    const [isNewPasswordOpen, setIsNewPasswordOpen] = useState(false);
    const [isAddModeratorOpen, setIsAddModeratorOpen] = useState(false);
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            setIsLoggedIn(true);
            const email = localStorage.getItem('email');
            const role = localStorage.getItem('role');
            setLoginData({ email, role });
        }
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const resetToken = searchParams.get('token');
        if (resetToken) {
            setToken(resetToken);
            setIsNewPasswordOpen(true);
        }
    }, [location.search]);

    const openRegistrationModal = () => setIsRegistrationOpen(true);
    const closeRegistrationModal = () => setIsRegistrationOpen(false);
    const openLoginModal = () => setIsLoginOpen(true);
    const closeLoginModal = () => setIsLoginOpen(false);
    const openPasswordResetModal = () => setIsPasswordResetOpen(true);
    const closePasswordResetModal = () => setIsPasswordResetOpen(false);
    const openAddModeratorModal = () => setIsAddModeratorOpen(true);
    const closeAddModeratorModal = () => setIsAddModeratorOpen(false);
    const closeNewPasswordModal = () => setIsNewPasswordOpen(false);

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        setLoginData({ email: '', password: '', role: '' });
        setMessage('Wylogowano');
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <div className="App">
            <Navbar
                isLoggedIn={isLoggedIn}
                loginData={loginData}
                onLogout={handleLogout}
                onOpenLogin={openLoginModal}
                onOpenRegistration={openRegistrationModal}
                onOpenPasswordReset={openPasswordResetModal}
                openAddModeratorModal={openAddModeratorModal}
            />
            {message && <div className="alert-message">{message}</div>}

            <div className="main-content">
                <RegistrationModal
                    isOpen={isRegistrationOpen}
                    onClose={closeRegistrationModal}
                    onOpenLogin={openLoginModal}
                />
                <LoginModal
                    isOpen={isLoginOpen}
                    onClose={closeLoginModal}
                    setIsLoggedIn={setIsLoggedIn}
                    setLoginData={setLoginData}
                />
                <PasswordResetModal
                    isOpen={isPasswordResetOpen}
                    onClose={closePasswordResetModal}
                />
                <NewPasswordModal
                    isOpen={isNewPasswordOpen}
                    onClose={closeNewPasswordModal}
                    token={token}
                />
                <AddModeratorForm
                    isOpen={isAddModeratorOpen}
                    onClose={closeAddModeratorModal}
                />

                <Routes>
                    <Route path="/admin-panel" element={<AdminPanel />} />
                </Routes>

                <h1>Add Stadium</h1>
                <AddStadiumForm />
            </div>
        </div>
    );
}

export default App;
