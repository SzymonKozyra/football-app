import React from 'react';
import { Link } from 'react-router-dom';
import DeleteAccountButton from './DeleteAccountButton';

const Navbar = ({ isLoggedIn, loginData, onLogout, onDeleteAccount, onOpenLogin, onOpenRegistration, onOpenPasswordReset, openAddModeratorModal }) => {
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
                        <button onClick={onOpenLogin} className="navbar-btn">Zaloguj się</button>
                        <button onClick={onOpenRegistration} className="navbar-btn">Zarejestruj się</button>
                        <button onClick={onOpenPasswordReset} className="navbar-btn">Odzyskiwanie hasła</button>
                    </>
                ) : (
                    <>
                        <span className="navbar-email">{loginData.email}</span>
                        {loginData.role === 'ROLE_ADMIN' && (
                            <>
                                <button onClick={openAddModeratorModal} className="navbar-btn">Dodaj moderatora</button>
                                <Link to="/admin-panel">
                                    <button className="navbar-btn">Panel administracyjny</button>
                                </Link>
                            </>
                        )}
                        <button onClick={onLogout} className="navbar-btn">Wyloguj się</button>
                        <DeleteAccountButton
                            onAccountDeleted={onLogout}
                            navbutton={(handleDeleteAccount) => (
                                <button onClick={handleDeleteAccount} className="navbar-btn">Usuń konto</button>
                            )}
                        />
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
