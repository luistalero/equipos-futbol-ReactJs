import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/components/navlinkbutton.css';

const NavLinkButton = ({ to, label }) => {
    return (
        <Link to={to} className="nav-link-button">
            {label}
        </Link>
    );
};

export default NavLinkButton;