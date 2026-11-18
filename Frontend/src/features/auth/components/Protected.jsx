import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router";
import React from 'react'
import Navbar from "../../../components/Navbar";
import "../auth.form.scss"

const Protected = ({ children }) => {
    const { loading, user } = useAuth()

    if (loading) {
        return (
            <div className="auth-loading-page">
                <div className="auth-loading-spinner" />
                <span className="auth-loading-text">Loading your workspace...</span>
            </div>
        )
    }

    if (!user) {
        return <Navigate to={'/login'} />
    }

    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default Protected
