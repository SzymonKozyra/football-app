import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import RegistrationModal from './components/RegistrationModal';
import LoginModal from './components/LoginModal';
import PasswordResetModal from './components/PasswordResetModal';
import NewPasswordModal from './components/NewPasswordModal';
import AddModeratorForm from './components/AddModeratorForm';
import { useLocation, Route, Routes } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import AddLeagueForm from './components/AddLeagueForm';
import AddCoachesTransferForm from './components/AddCoachesTransferForm';
import AddCoachForm from './components/AddCoachForm';
import RegisterAdminForm from './components/RegisterAdminForm';
import './components/Navbar.css';
import CountryList from './components/CountryList';
import CoachSearchAndEditForm from "./components/CoachSearchAndEditForm";
import LeagueSearchAndEditForm from "./components/LeagueSearchAndEditForm";
import StadiumSearchAndEditForm from "./components/StadiumSearchAndEditForm";
import AddCityForm from "./components/AddCityForm";
import AddTeamForm from "./components/AddTeamForm";
import TeamSearchAndEditForm from "./components/TeamSearchAndEditForm";
import AddStadiumForm from "./components/AddStadiumForm";

function App() {
    const [modals, setModals] = useState({
        isRegistrationOpen: false,
        isLoginOpen: false,
        isPasswordResetOpen: false,
        isNewPasswordOpen: false,
        isAddModeratorOpen: false,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', role: '' });
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [adminExists, setAdminExists] = useState(false);
    const location = useLocation();

    useEffect(() => {
        axios.get('http://localhost:8080/api/auth/check-admin')
            .then(response => setAdminExists(response.data))
            .catch(error => console.error("Error checking if admin exists:", error));
    }, []);

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
            setModals((prevModals) => ({ ...prevModals, isNewPasswordOpen: true }));
        }
    }, [location.search]);

    const toggleModal = (modalName) => {
        setModals((prevModals) => ({
            ...prevModals,
            [modalName]: !prevModals[modalName],
        }));
    };

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        setIsLoggedIn(false);
        setLoginData({ email: '', role: '' });
        setMessage('Successfully logged out');
        setTimeout(() => setMessage(''), 3000);
    };

    if (!adminExists) {
        return (
            <div className="App">
                <h1>Register Admin</h1>
                <RegisterAdminForm />
            </div>
        );
    }

    return (
        <div className="App">
            <Navbar
                isLoggedIn={isLoggedIn}
                loginData={loginData}
                onLogout={handleLogout}
                setIsLoggedIn={setIsLoggedIn}
                setMessage={setMessage}
                onOpenLogin={() => toggleModal('isLoginOpen')}
                onOpenRegistration={() => toggleModal('isRegistrationOpen')}
                onOpenPasswordReset={() => toggleModal('isPasswordResetOpen')}
                openAddModeratorModal={() => toggleModal('isAddModeratorOpen')}
            />
            {message && <div className="alert-message">{message}</div>}

            <div className="main-content">
                <RegistrationModal
                    isOpen={modals.isRegistrationOpen}
                    onClose={() => toggleModal('isRegistrationOpen')}
                    onOpenLogin={() => toggleModal('isLoginOpen')}
                />
                <LoginModal
                    isOpen={modals.isLoginOpen}
                    onClose={() => toggleModal('isLoginOpen')}
                    setIsLoggedIn={setIsLoggedIn}
                    setLoginData={setLoginData}
                />
                <PasswordResetModal
                    isOpen={modals.isPasswordResetOpen}
                    onClose={() => toggleModal('isPasswordResetOpen')}
                />
                <NewPasswordModal
                    isOpen={modals.isNewPasswordOpen}
                    onClose={() => toggleModal('isNewPasswordOpen')}
                    token={token}
                />
                <AddModeratorForm
                    isOpen={modals.isAddModeratorOpen}
                    onClose={() => toggleModal('isAddModeratorOpen')}
                />

                <Routes>
                    <Route path="/admin-panel" element={<AdminPanel />} />
                </Routes>

                {/*<CountryList />*/}

                <h1>Add Stadium</h1>
                <AddStadiumForm />

                <h1>Add League</h1>
                <AddLeagueForm />

                <h1>Add Coach</h1>
                <AddCoachForm />

                <h1>Edit Coach</h1>
                <CoachSearchAndEditForm />

                <h1>Edit League</h1>
                <LeagueSearchAndEditForm />

                <h1>Edit Stadium</h1>
                <StadiumSearchAndEditForm />

                <h1>Add CoachesTransfer</h1>
                <AddCoachesTransferForm />

                <h1>Add City</h1>
                <AddCityForm />

                <h1>Add Team</h1>
                <AddTeamForm />

                <h1>Edit Team</h1>
                <TeamSearchAndEditForm />


            </div>
        </div>
    );
}

export default App;
