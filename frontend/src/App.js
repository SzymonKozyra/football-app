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
import AddRefereeForm from "./components/AddRefereeForm";
import RefereeSearchAndEditForm from "./components/RefereeSearchAndEditForm";
import AddPlayerForm from "./components/AddPlayerForm";
import PlayerSearchAndEditForm from "./components/PlayerSearchAndEditForm";

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
    const [showAdminPanel, setShowAdminPanel] = useState(false);

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
        localStorage.setItem('logoutOrDeleteAccMessage', 'Successfully logged out');
        window.location.reload();
    };

    useEffect(() => {
        const logoutOrDeleteAccMessage = localStorage.getItem('logoutOrDeleteAccMessage');
        if (logoutOrDeleteAccMessage) {
            setMessage(logoutOrDeleteAccMessage);
            localStorage.removeItem('logoutOrDeleteAccMessage');
            setTimeout(() => {
                setMessage('');
            }, 2000);
        }
    }, []);

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
                setShowAdminPanel={setShowAdminPanel}
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
                    <Route path="/admin-panel" element={showAdminPanel ? <AdminPanel /> : null} />
                </Routes>

                {/*<CountryList />*/}

                <AddStadiumForm />

                <StadiumSearchAndEditForm />

                <AddLeagueForm />

                <LeagueSearchAndEditForm />

                <AddCoachForm />

                <CoachSearchAndEditForm />

                <AddCoachesTransferForm />

                <AddCityForm />

                <h1>Add Team</h1>
                <AddTeamForm />

                <h1>Edit Team</h1>
                <TeamSearchAndEditForm />

                <h1>Add referee</h1>
                <AddRefereeForm />
                <h1>Edit referee</h1>
                <RefereeSearchAndEditForm />


                <h1>Add player</h1>
                <AddPlayerForm />
                <h1>Edit player</h1>
                <PlayerSearchAndEditForm />

            </div>
        </div>
    );
}

export default App;
