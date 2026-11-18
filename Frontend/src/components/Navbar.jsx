import React from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import '../style/navbar.scss'

const Navbar = () => {
    const { user, handleLogout } = useAuth()
    const navigate = useNavigate()

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    return (
        <nav className="navbar">
            <Link to="/" className="navbar__brand">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ff2d78" opacity="0.8"/>
                    <path d="M2 17L12 22L22 17" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                </svg>
                <span className="navbar__logo-text">Interview<span className="navbar__logo-accent">AI</span></span>
            </Link>
            <div className="navbar__right">
                {user && (
                    <>
                        <span className="navbar__greeting">
                            Hey, <strong>{user.username || user.email}</strong>
                        </span>
                        <button className="navbar__logout" onClick={onLogout}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    )
}

export default Navbar
