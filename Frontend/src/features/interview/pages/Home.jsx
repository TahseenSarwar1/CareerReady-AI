import React, { useState, useRef, useCallback } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'

const Home = () => {

    const { loading, generating, generateReport, reports } = useInterview()
    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFile, setResumeFile] = useState(null)
    const [validationError, setValidationError] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [fakeProgress, setFakeProgress] = useState(0)
    const resumeInputRef = useRef()
    const progressInterval = useRef(null)

    const navigate = useNavigate()

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / 1048576).toFixed(1) + ' MB'
    }

    // File selection handler
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setResumeFile(file)
            setValidationError("")
        }
    }

    // Remove file
    const handleRemoveFile = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setResumeFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    // Validation
    const isFormValid = jobDescription.trim().length > 0 && (resumeFile || selfDescription.trim().length > 0)

    // Char counter color
    const getCharCounterClass = () => {
        const len = jobDescription.length
        if (len >= 4900) return 'char-counter char-counter--danger'
        if (len >= 4500) return 'char-counter char-counter--warning'
        return 'char-counter'
    }

    // Start fake progress
    const startFakeProgress = useCallback(() => {
        setFakeProgress(0)
        let progress = 0
        progressInterval.current = setInterval(() => {
            progress += Math.random() * 8 + 2
            if (progress > 92) progress = 92
            setFakeProgress(Math.round(progress))
        }, 800)
    }, [])

    const stopFakeProgress = useCallback(() => {
        if (progressInterval.current) {
            clearInterval(progressInterval.current)
            progressInterval.current = null
        }
        setFakeProgress(100)
    }, [])

    // Generate handler
    const handleGenerateReport = async () => {
        setErrorMessage("")
        setValidationError("")

        if (!jobDescription.trim()) {
            setValidationError("Please enter a job description.")
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            setValidationError("Please upload a resume or provide a self-description.")
            return
        }

        startFakeProgress()

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            stopFakeProgress()
            navigate(`/interview/${data._id}`)
        } catch (error) {
            stopFakeProgress()
            setErrorMessage(
                error?.response?.data?.message ||
                error?.message ||
                "Something went wrong while generating your interview plan. Please try again."
            )
        }
    }

    // Loading screen
    if (loading) {
        return (
            <main className='loading-screen'>
                <div className="loading-screen__spinner"></div>
                <p>Loading your data...</p>
            </main>
        )
    }

    // Score color helper
    const getScoreColor = (score) => {
        if (score >= 80) return '#22c55e'
        if (score >= 60) return '#eab308'
        return '#ef4444'
    }

    return (
        <div className='home-page'>

            {/* Generating Overlay */}
            {generating && (
                <div className="generating-overlay">
                    <div className="generating-modal">
                        <div className="generating-modal__pulse"></div>
                        <div className="generating-modal__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
                            </svg>
                        </div>
                        <h2>Generating your personalized interview strategy...</h2>
                        <p className="generating-modal__subtitle">This usually takes about 30 seconds</p>
                        <div className="generating-modal__progress-bar">
                            <div
                                className="generating-modal__progress-fill"
                                style={{ width: `${fakeProgress}%` }}
                            ></div>
                        </div>
                        <p className="generating-modal__percent">{fakeProgress}%</p>
                        <div className="generating-modal__dots">
                            <span></span><span></span><span></span>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Toast */}
            {errorMessage && (
                <div className="error-toast">
                    <div className="error-toast__content">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                        <span>{errorMessage}</span>
                    </div>
                    <button className="error-toast__close" onClick={() => setErrorMessage("")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Page Header */}
            <header className='page-header'>
                <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <div className='panel panel--left'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2>Target Job Description</h2>
                            <span className='badge badge--required'>Required</span>
                        </div>
                        <textarea
                            value={jobDescription}
                            onChange={(e) => { setJobDescription(e.target.value); setValidationError("") }}
                            className='panel__textarea'
                            placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                            maxLength={5000}
                        />
                        <div className={getCharCounterClass()}>{jobDescription.length} / 5000 chars</div>
                    </div>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <div className='panel panel--right'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <label className='section-label'>
                                Upload Resume
                                <span className='badge badge--best'>Best Results</span>
                            </label>
                            {resumeFile ? (
                                <div className='dropzone dropzone--attached'>
                                    <span className='dropzone__check'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                    </span>
                                    <p className='dropzone__filename'>{resumeFile.name}</p>
                                    <p className='dropzone__filesize'>{formatFileSize(resumeFile.size)}</p>
                                    <button className='dropzone__remove' onClick={handleRemoveFile}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <label className='dropzone' htmlFor='resume'>
                                    <span className='dropzone__icon'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    </span>
                                    <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                    <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                    <input ref={resumeInputRef} hidden type='file' id='resume' name='resume' accept='.pdf,.docx' onChange={handleFileChange} />
                                </label>
                            )}
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => { setSelfDescription(e.target.value); setValidationError("") }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </div>
                </div>

                {/* Validation Error */}
                {validationError && (
                    <div className='validation-error'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        {validationError}
                    </div>
                )}

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 30s</span>
                    <button
                        onClick={handleGenerateReport}
                        className={`generate-btn ${!isFormValid || generating ? 'generate-btn--disabled' : ''}`}
                        disabled={!isFormValid || generating}
                    >
                        {generating ? (
                            <>
                                <span className="btn-spinner"></span>
                                Generating...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                                Generate My Interview Strategy
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            <section className='recent-reports'>
                <h2>My Recent Interview Plans</h2>
                {reports.length === 0 ? (
                    <div className='reports-empty'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <p>No interview plans yet — create your first one above!</p>
                    </div>
                ) : (
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <div className="report-item__top">
                                    <h3>{report.title || 'Untitled Position'}</h3>
                                    <span className="report-item__chevron">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                                    </span>
                                </div>
                                {report.summary && (
                                    <p className='report-item__summary'>{report.summary.length > 120 ? report.summary.slice(0, 120) + '...' : report.summary}</p>
                                )}
                                <div className="report-item__bottom">
                                    <p className='report-item__meta'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                        {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    {report.matchScore != null && (
                                        <div className="report-item__score">
                                            <svg width="24" height="24" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" fill="none" stroke="#2a3348" strokeWidth="3" />
                                                <circle
                                                    cx="12" cy="12" r="10"
                                                    fill="none"
                                                    stroke={getScoreColor(report.matchScore)}
                                                    strokeWidth="3"
                                                    strokeDasharray={`${(report.matchScore / 100) * 62.83} 62.83`}
                                                    strokeLinecap="round"
                                                    transform="rotate(-90 12 12)"
                                                />
                                            </svg>
                                            <span style={{ color: getScoreColor(report.matchScore) }}>{report.matchScore}%</span>
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {/* Page Footer */}
            <footer className='page-footer'>
                <a href='#'>Privacy Policy</a>
                <a href='#'>Terms of Service</a>
                <a href='#'>Help Center</a>
            </footer>
        </div>
    )
}

export default Home
