import { Link } from 'react-router-dom';
import DeleteAccountButton from './DeleteAccountButton';
import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = ({ isLoggedIn, loginData, onLogout, onOpenLogin, onOpenRegistration, onOpenPasswordReset, openAddModeratorModal, openAddAdminModal, currentMode, setCurrentMode, onModeSwitch }) => {
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
                <Link to="/" className="navbar-brand">
                    <img src="/logo.png" alt="Logo" style={{ width: '30px', marginRight: '10px' }} />
                    Football Application
                </Link>
                <div className="d-flex align-items-center">
                    {isLoggedIn && (loginData.role === 'ROLE_ADMIN' || loginData.role === 'ROLE_MODERATOR') && (
                        <button onClick={onModeSwitch} className="btn btn-outline-secondary me-2">
                            {currentMode === 'user' ? 'Switch to ' + loginData.role : 'Switch to User'}
                        </button>
                    )}
                    {isLoggedIn ? (
                        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
                            <DropdownToggle caret className="btn btn-outline-primary">
                                {loginData.email}
                            </DropdownToggle>
                            <DropdownMenu end>
                                <DropdownItem onClick={onOpenPasswordReset}>Change Password</DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem onClick={onLogout} className="text-danger">Logout</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <>
                            <button onClick={onOpenLogin} className="btn btn-outline-primary me-2">Login</button>
                            <button onClick={onOpenRegistration} className="btn btn-outline-success">Register</button>
                            {/*<button onClick={onOpenPasswordReset} className="navbar-btn">Password reset</button>*/}

                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;


// import React from 'react';
// import { Link } from 'react-router-dom';
// import DeleteAccountButton from './DeleteAccountButton';
//
// const Navbar = ({ isLoggedIn, loginData, onLogout, onOpenLogin, onOpenRegistration, onOpenPasswordReset, openAddModeratorModal, openAddAdminModal, setIsLoggedIn, setMessage }) => {
//     return (
//         <nav className="navbar">
//             <div className="navbar-left">
//                 <Link to="/" className="navbar-logo">
//                     <img src="/logo.png" alt="Logo" className="logo-image" />
//                 </Link>
//                 <span className="navbar-title">Football Application</span>
//             </div>
//             <div className="navbar-menu">
//                 {!isLoggedIn ? (
//                     <>
//                         <button onClick={onOpenLogin} className="navbar-btn">Login</button>
//                         <button onClick={onOpenRegistration} className="navbar-btn">Register</button>
//                         <button onClick={onOpenPasswordReset} className="navbar-btn">Password reset</button>
//                     </>
//                 ) : (
//                     <>
//                         <span className="navbar-email">{loginData.email}</span>
//                         {loginData.role === 'ROLE_ADMIN' && (
//                             <>
//                                 <button onClick={openAddAdminModal} className="navbar-btn">Add admin</button>
//                                 <button onClick={openAddModeratorModal} className="navbar-btn">Add moderator</button>
//                                 <Link to="/admin-panel">
//                                     <button className="navbar-btn">Administration panel</button>
//                                 </Link>
//                             </>
//                         )}
//                         <button onClick={onLogout} className="navbar-btn">Logout</button>
//                         <DeleteAccountButton
//                             setIsLoggedIn={setIsLoggedIn}
//                             setMessage={setMessage}
//                         />
//                     </>
//                 )}
//             </div>
//         </nav>
//     );
// };
//
// export default Navbar;
