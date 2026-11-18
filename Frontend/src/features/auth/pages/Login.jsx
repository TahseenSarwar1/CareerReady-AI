import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../../../contexts/toast.context'

const EyeIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
)

const EyeOffIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <line x1="1" y1="1" x2="23" y2="23" />
        <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
)

const ErrorIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
)

const Login = () => {
    const { loading, handleLogin } = useAuth()
    const { addToast } = useToast()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState("")

    const validate = () => {
        const errs = {}
        if (!email.trim()) {
            errs.email = "Email is required"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errs.email = "Please enter a valid email"
        }
        if (!password) {
            errs.password = "Password is required"
        } else if (password.length < 6) {
            errs.password = "Password must be at least 6 characters"
        }
        return errs
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setFormError("")
        const errs = validate()
        setErrors(errs)
        if (Object.keys(errs).length > 0) return

        try {
            await handleLogin({ email, password })
            addToast("Logged in successfully!", "success")
            navigate('/')
        } catch (err) {
            const msg = err?.response?.data?.message || err?.message || "Login failed. Please try again."
            setFormError(msg)
            addToast(msg, "error")
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-brand">
                <div className="auth-brand__logo">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#ff2d78" opacity="0.9"/>
                        <path d="M2 17L12 22L22 17" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M2 12L12 17L22 12" stroke="#ff2d78" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
                    </svg>
                </div>
                <h2 className="auth-brand__title">Interview<span>AI</span></h2>
                <p className="auth-brand__tagline">
                    Master your interviews with AI-powered practice sessions and real-time feedback.
                </p>
                <div className="auth-brand__decorative">
                    <span className="auth-brand__dot" />
                    <span className="auth-brand__dot" />
                    <span className="auth-brand__dot" />
                </div>
            </div>

            <div className="auth-form-panel">
                <div className="auth-form-wrapper">
                    <div className="auth-form-header">
                        <h1>Welcome back</h1>
                        <p>Sign in to continue your interview prep</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>
                        {formError && (
                            <div className="auth-error-banner">
                                <ErrorIcon />
                                <span>{formError}</span>
                            </div>
                        )}

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="email">Email</label>
                            <div className="auth-input-wrapper">
                                <input
                                    className={`auth-input ${errors.email ? 'auth-input--error' : ''}`}
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: '' })) }}
                                />
                            </div>
                            {errors.email && <span className="auth-input-error">{errors.email}</span>}
                        </div>

                        <div className="auth-input-group">
                            <label className="auth-input-label" htmlFor="password">Password</label>
                            <div className="auth-input-wrapper">
                                <input
                                    className={`auth-input auth-input--has-toggle ${errors.password ? 'auth-input--error' : ''}`}
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: '' })) }}
                                />
                                <button
                                    type="button"
                                    className="auth-input-toggle"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    tabIndex={-1}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                                </button>
                            </div>
                            {errors.password && <span className="auth-input-error">{errors.password}</span>}
                        </div>

                        <button
                            className="auth-submit-btn"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="auth-spinner" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
