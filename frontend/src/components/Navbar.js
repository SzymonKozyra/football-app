import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DeleteAccountButton from './DeleteAccountButton';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const Navbar = ({
                    isLoggedIn,
                    setIsLoggedIn,
                    loginData,
                    onLogout,
                    onOpenLogin,
                    onOpenRegistration,
                    onOpenPasswordReset,
                    onModeSwitch,
                    currentMode
                }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isMenuActive, setIsMenuActive] = useState(false); // Dodanie stanu dla menu rozwijanego

    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);
    const toggleMenu = () => setIsMenuActive(prevState => !prevState); // Funkcja do otwierania/zamykania menu

    return (
        <nav className="navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-logo">
                    <img src="/assets/logo.png" alt="Logo" />
                </Link>
                <button className="menu-toggle" onClick={toggleMenu}>
                    ☰ {/* Ikona hamburger */}
                </button>
                <div className={`navbar-menu ${isMenuActive ? 'active' : ''}`}>
                    {isLoggedIn && (loginData.role === 'ROLE_ADMIN' || loginData.role === 'ROLE_MODERATOR') && (
                        <>
                            <span className="role">Role: {loginData.role === 'ROLE_ADMIN' ? 'ADMIN' : 'MODERATOR'}</span>

                            <button onClick={onModeSwitch} className="btn btn-outline-secondary btn-switchMode navbar-btn">
                                {currentMode === 'user'
                                    ? `Switch to ${loginData.role === 'ROLE_ADMIN' ? 'ADMIN' : 'MOD'} View`
                                    : 'Switch to USER View'}
                            </button>
                        </>
                    )}
                    {isLoggedIn ? (
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret className="btn btn-dark navbar-btn btn-email">
                                {loginData.email}
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem onClick={onOpenPasswordReset} className="passwordButton">
                                    Change Password
                                </DropdownItem>
                                <DropdownItem divider />
                                <DeleteAccountButton setIsLoggedIn={setIsLoggedIn} />
                                <DropdownItem divider />
                                <DropdownItem onClick={onLogout} className="logoutButton">
                                    Logout
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <>
                            <button onClick={onOpenLogin} className="btn btn-primary navbar-btn btn-login">
                                Login
                            </button>
                            <button onClick={onOpenRegistration} className="btn btn-dark navbar-btn btn-register">
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
