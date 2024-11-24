import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from 'react-bootstrap';
import Navbar from './components/Navbar';
import RegistrationModal from './components/RegistrationModal';
import LoginModal from './components/LoginModal';
import PasswordResetModal from './components/PasswordResetModal';
import NewPasswordModal from './components/NewPasswordModal';
import { useLocation, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import AddLeagueForm from './components/AddLeagueForm';

//import AddCoachesTransferForm from './components/AddCoachesTransferForm';
import AddCoachForm from './components/AddCoachForm';
import RegisterAdminForm from './components/RegisterAdminForm';
import './App.css';
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
import PlayerImportForm from "./components/PlayerImportForm";
import AddCoachContractForm from "./components/AddCoachContractForm";
import EditCoachContractForm from "./components/EditCoachContractForm";
import AddPlayerContractForm from "./components/AddPlayerContractForm";
import EditPlayerContractForm from "./components/EditPlayerContractForm";
import AddInjuryForm from "./components/AddInjuryForm";
import EditInjuryForm from "./components/EditInjuryForm";
import AddBetForm from "./components/AddBetForm";
import EditBetForm from "./components/EditBetForm";

//import AddTournamentForm from "./components/AddTournamentForm";
//import TournamentSearchAndEditForm from "./components/TournamentSearchAndEditForm";
import AddMatchForm from "./components/AddMatchForm";
import EditMatchForm from "./components/EditMatchForm";
import AdminView from './views/AdminView';
import ModeratorView from './views/ModeratorView';
import UserView from './views/UserView';


//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddMatchSquadForm from './components/AddMatchSquadForm';
import AddPlayersMatchSquadForm from './components/AddPlayersMatchSquadForm';
import AddRankingForm from './components/AddRankingForm';
import EventManagement from "./components/EventManagement";
import MainView from "./components/MainView";
import MatchDetail from "./components/MatchDetail";



function App() {
    const [modals, setModals] = useState({
        isRegistrationOpen: false,
        isLoginOpen: false,
        isPasswordResetOpen: false,
        isNewPasswordOpen: false,
        isAddModeratorOpen: false,
        isAddAdminOpen: false,
    });

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginData, setLoginData] = useState({ email: '', role: '' });
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [adminExists, setAdminExists] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [currentMode, setCurrentMode] = useState('user'); // New state for tracking mode


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
        } else {
            setIsLoggedIn(false);
            setLoginData({ email: '', role: '' });
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

    useEffect(() => {
        // Initialize mode based on role
        if (loginData.role === 'ROLE_ADMIN') {
            setCurrentMode('admin');
        } else if (loginData.role === 'ROLE_MODERATOR') {
            setCurrentMode('moderator');
        }
    }, [loginData]);


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
        localStorage.setItem('logoutOrDeleteAccMessage', 'You have been logged out');
        setTimeout(() => {
            setMessage('');
        }, 2000);
        navigate('/');
        window.scrollTo(0, 0);
        window.location.reload();
    };

    const handleNewPasswordSubmit = async (newPassword) => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/reset-password-confirm', {
                token, // token should be in the state or retrieved from the URL
                password: newPassword,
            });

            if (response.status === 200) {
                console.log("Password reset successfully!");
                //toggleModal('isNewPasswordOpen');
            }
        } catch (error) {
            console.error("Error resetting password:", error);
        }
    };

    const handleModeSwitch = () => {
        setCurrentMode((prevMode) => {
            if (loginData.role === 'ROLE_ADMIN') {
                return prevMode === 'admin' ? 'user' : 'admin';
            } else if (loginData.role === 'ROLE_MODERATOR') {
                return prevMode === 'moderator' ? 'user' : 'moderator';
            }
            return 'user';
        });
    };


    useEffect(() => {
        const logoutOrDeleteAccMessage = localStorage.getItem('logoutOrDeleteAccMessage');
        if (logoutOrDeleteAccMessage) {
            setMessage(logoutOrDeleteAccMessage);
            setMessageType('success');
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
            <div className="navbar">
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
                    openAddAdminModal={() => toggleModal('isAddAdminOpen')}
                    onModeSwitch={handleModeSwitch} // Pass handleModeSwitch to Navbar
                    currentMode={currentMode}
                />
            </div>

            {message && (<Alert variant={messageType} className="mb-3">{message}</Alert>)}

            <div className="main-content">
                {currentMode === 'admin' && <AdminView handleLogout={handleLogout}/>}
                {currentMode === 'moderator' && <ModeratorView />}
                {currentMode === 'user' && <MainView />}
                {/*{currentMode === 'user' && <MainView />}*/}
            </div>
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
                    onOpenPasswordReset={() => toggleModal('isPasswordResetOpen')}
                />
                <PasswordResetModal
                    isOpen={modals.isPasswordResetOpen}
                    onClose={() => toggleModal('isPasswordResetOpen')}
                />
                <NewPasswordModal
                    isOpen={modals.isNewPasswordOpen}
                    onClose={() => toggleModal('isNewPasswordOpen')}
                    onSubmit={handleNewPasswordSubmit} // Pass the function here
                    token={token}
                />

                <Routes>
                    <Route path="/add-match" element={<AddMatchForm />} />
                    <Route path="/add-match-squad/:matchId" element={<AddMatchSquadForm />} />
                    <Route path="/add-players-match-squad/:matchSquadId" element={<AddPlayersMatchSquadForm />} />

                    <Route
                        path="/admin-panel"
                        element={
                            isLoggedIn && loginData.role === 'ROLE_ADMIN' ? (
                                <AdminPanel/>
                            ) : (
                                <Navigate to="/" replace />
                            )
                        }
                    />

                    <Route path="/manage-events/:matchId" element={<EventManagement />} />
                    {/* Route for the main view */}
                    <Route path="/" element={<MainView />} />

                    {/* Route for the match detail view */}
                    <Route path="/match/:matchId" element={<MatchDetail />} />
                </Routes>
        </div>
    );
}

export default App;
