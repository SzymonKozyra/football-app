import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DeleteAccountButton from './DeleteAccountButton';

const Navbar = ({ isLoggedIn, loginData, onLogout, onOpenLogin, onOpenRegistration, onOpenPasswordReset, openAddModeratorModal, setIsLoggedIn, setMessage, setShowAdminPanel }) => {

    const handleAdminPanelClick = () => {
        setShowAdminPanel(true);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="navbar-logo">
                    <img src="/logo.png" alt="Logo" className="logo-image" />
                </Link>
                <span className="navbar-title">Football Application</span>
            </div>
            <div className="navbar-menu">
                {!isLoggedIn ? (
                    <>
                        <button onClick={onOpenLogin} className="navbar-btn">Login</button>
                        <button onClick={onOpenRegistration} className="navbar-btn">Register</button>
                        <button onClick={onOpenPasswordReset} className="navbar-btn">Password reset</button>
                    </>
                ) : (
                    <>
                        <span className="navbar-email">{loginData.email}</span>
                        {loginData.role === 'ROLE_ADMIN' && (
                            <>
                                <button onClick={openAddModeratorModal} className="navbar-btn">Add moderator</button>
                                <button onClick={handleAdminPanelClick} className="navbar-btn">Administration panel</button>
                            </>
                        )}
                        <button onClick={onLogout} className="navbar-btn">Logout</button>
                        <DeleteAccountButton
                            setIsLoggedIn={setIsLoggedIn}
                            setMessage={setMessage}
                        />
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
