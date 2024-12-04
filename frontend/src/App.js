import React, {useEffect, useState} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Alert} from 'react-bootstrap';
import Navbar from './components/Navbar';
import RegistrationModal from './components/RegistrationModal';
import LoginModal from './components/LoginModal';
import PasswordResetModal from './components/PasswordResetModal';
import NewPasswordModal from './components/NewPasswordModal';
import {Navigate, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
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
import RankingView from "./components/RankingView";
import EditRankingForm from "./components/EditRankingForm";

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
import LeagueView from "./components/LeagueView";
import LeaguePage from "./components/LeaguePage";
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
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [adminExists, setAdminExists] = useState(false);
    const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
    const location = useLocation();

    useEffect(() => {
        axios.get('http://localhost:8080/api/auth/check-admin')
            .then(response => setAdminExists(response.data))
            .catch(error => console.error("Error checking if admin exists:", error))
            .finally(() => setIsCheckingAdmin(false));
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

    if (isCheckingAdmin) {
        return null;
    }

    if (!adminExists) {
        return (
            <div className="App">
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
                    onLogout={() => {
                        localStorage.removeItem('jwtToken');
                        setIsLoggedIn(false);
                        setLoginData({ email: '', role: '' });
                    }}
                />
            </div>

            {message && (<Alert variant={messageType} className="mb-3">{message}</Alert>)}

            <Routes>
                <Route path="/" element={<MainView />} />
                <Route path="/league/:id" element={<LeaguePage />} />
                {/* Inne trasy */}
            </Routes>

            {/* Modale */}
            <RegistrationModal
                isOpen={modals.isRegistrationOpen}
                onClose={() => setModals((prev) => ({ ...prev, isRegistrationOpen: false }))}
            />
            <LoginModal
                isOpen={modals.isLoginOpen}
                onClose={() => setModals((prev) => ({ ...prev, isLoginOpen: false }))}
                setIsLoggedIn={setIsLoggedIn}
                setLoginData={setLoginData}
            />
        </div>
    );
}

export default App;

