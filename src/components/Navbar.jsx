import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Heart } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import LanguageSelector from './LanguageSelector';
import '../styles/Navbar.css';

const Navbar = () => {
    const { favorites } = useGlobalContext();
    // checks which page we are on
    const location = useLocation();

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                {/* website logo */}
                <Link to="/" className="navbar-logo">
                    <Film className="logo-icon" />
                    <span className="logo-text">Cine<span className="highlight">Scope</span></span>
                </Link>

                <div className="navbar-links">
                    {/* link to home page */}
                    <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
                        Home
                    </Link>
                    {/* link to favorites page */}
                    <Link to="/favorites" className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}>
                        <Heart className="nav-icon" size={18} fill={location.pathname === '/favorites' ? 'currentColor' : 'none'} />
                        Favorites
                        {/* showing count if there are any favorites */}
                        {favorites.length > 0 && <span className="badge">{favorites.length}</span>}
                    </Link>
                    {/* dropdown to pick language */}
                    <LanguageSelector />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
