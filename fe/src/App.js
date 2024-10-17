import React, { useEffect, useState } from 'react';
import RegistrationModal from './components/RegistrationModal';
import LoginModal from './components/LoginModal';
import PasswordResetModal from './components/PasswordResetModal';
import NewPasswordModal from './components/NewPasswordModal';
import AddModeratorForm from './components/AddModeratorForm';
import DeleteAccountButton from './components/DeleteAccountButton';
import { useLocation, Link, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import CountryList from "./components/CountryList";
import AddStadiumForm from './components/AddStadiumForm'; // Import the stadium form

function App() {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', password: '', role: '' });
    const [isPasswordResetOpen, setIsPasswordResetOpen] = useState(false);
    const [isNewPasswordOpen, setIsNewPasswordOpen] = useState(false);
    const [isAddModeratorOpen, setIsAddModeratorOpen] = useState(false);
    const [token, setToken] = useState('');

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
    };

    return (
        <div>
            <h1>Moja Aplikacja</h1>
            {isLoggedIn ? (
                <div>
                    <p>Zalogowany jako: {loginData.email}</p>
                    <button onClick={handleLogout}>Wyloguj się</button>
                    {loginData.role === 'ROLE_ADMIN' && (
                        <>
                            <button onClick={openAddModeratorModal}>Dodaj moderatora</button>
                            <Link to="/admin-panel">
                                <button>Panel administracyjny</button>
                            </Link>
                        </>
                    )}
                    <DeleteAccountButton onAccountDeleted={handleLogout} />
                </div>
            ) : (
                <>
                    <button onClick={openRegistrationModal}>Zarejestruj się</button>
                    <button onClick={openLoginModal}>Zaloguj się</button>
                    <button onClick={openPasswordResetModal}>Resetuj Hasło</button>
                </>
            )}
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

            {/*<h1>Country List with Flags</h1>*/}
            {/*<CountryList />*/}

            <h1>Add Stadium</h1>
            <AddStadiumForm /> {/* Add the stadium form here */}
        </div>
    );
}

export default App;
