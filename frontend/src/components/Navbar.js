import { Link } from 'react-router-dom';
import DeleteAccountButton from './DeleteAccountButton';
import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css';

const Navbar = ({ isLoggedIn, setIsLoggedIn, loginData, onLogout, onOpenLogin, onOpenRegistration, onOpenPasswordReset, openAddModeratorModal, openAddAdminModal, currentMode, setCurrentMode, onModeSwitch }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

    const handleModeSwitch = () => {
        if (loginData.role === 'ROLE_ADMIN') {
            setCurrentMode(currentMode === 'admin' ? 'user' : 'admin');
        } else if (loginData.role === 'ROLE_MODERATOR') {
            setCurrentMode(currentMode === 'moderator' ? 'user' : 'moderator');
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link to="/" className="navbar-logo">
                    <img src="/assets/logo.png" alt="Logo" height={200}/>
                </Link>
                <div className="d-flex align-items-center">
                    {isLoggedIn && (loginData.role === 'ROLE_ADMIN' || loginData.role === 'ROLE_MODERATOR') && (
                        <>
                            <span className="role">Role: {loginData.role === 'ROLE_ADMIN' ? 'ADMIN' : 'MODERATOR'}</span>
                            <button onClick={onModeSwitch} className="btn btn-outline-secondary btn-switchMode navbar-btn">
                                {currentMode === 'user' ? `Switch to ${loginData.role === 'ROLE_ADMIN' ? 'ADMIN' : 'MOD'} View` : 'Switch to USER View'}
                            </button>
                        </>
                    )}
                    {isLoggedIn ? (
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret className="btn btn-dark navbar-btn">
                                {loginData.email}
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem onClick={onOpenPasswordReset} className="passwordButton">Change Password</DropdownItem>
                                <DropdownItem divider />
                                <DeleteAccountButton setIsLoggedIn={setIsLoggedIn}/>
                                <DropdownItem divider />
                                <DropdownItem onClick={onLogout} className="logoutButton">Logout</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <>
                            <button onClick={onOpenLogin} className="btn btn-primary me-2 navbar-btn">Login</button>
                            <button onClick={onOpenRegistration} className="btn btn-dark navbar-btn">Register</button>
                            {/*<button onClick={onOpenPasswordReset} className="navbar-btn">Password reset</button>*/}

                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
