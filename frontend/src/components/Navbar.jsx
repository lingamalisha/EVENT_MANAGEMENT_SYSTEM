import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Calendar, PlusCircle, Menu, LayoutDashboard, Settings } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        setIsDropdownOpen(false);
        logout();
        navigate('/login');
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="nav">
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>Evently</Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: '500' }}>Home</Link>

                {user ? (
                    <div style={{ position: 'relative' }} ref={dropdownRef}>
                        <button 
                            className="hamburger-btn"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 12px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', borderRadius: '100px' }}
                        >
                            <Menu size={20} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <User size={16} color="var(--primary-accent)" />
                                <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>{user.name.split(' ')[0]}</span>
                            </div>
                        </button>

                        {isDropdownOpen && (
                            <div className="dropdown-menu">
                                <div style={{ padding: '8px 16px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Logged in as <strong>{user.role}</strong>
                                </div>
                                <div className="dropdown-divider"></div>
                                
                                {user.role === 'admin' ? (
                                    <>
                                        <Link to="/manage-events" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <LayoutDashboard size={18} />
                                            Manage Events
                                        </Link>
                                        <Link to="/create-event" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                            <PlusCircle size={18} />
                                            Add Event
                                        </Link>
                                    </>
                                ) : (
                                    <Link to="/my-registrations" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>
                                        <Calendar size={18} />
                                        My Events
                                    </Link>
                                )}

                                <div className="dropdown-divider"></div>
                                <div className="dropdown-item" onClick={handleLogout} style={{ color: '#ff636d' }}>
                                    <LogOut size={18} />
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" style={{ color: 'white', textDecoration: 'none', padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.875rem', fontWeight: '500' }}>Admin Login</Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
