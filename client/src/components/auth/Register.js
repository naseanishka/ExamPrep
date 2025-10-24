import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        userName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.name || !formData.userName || !formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const result = await register({
                name: formData.name,
                userName: formData.userName,
                email: formData.email,
                password: formData.password,
                role: formData.role
            });

            if (result.success) {
                if (result.user.role === 'teacher') {
                    navigate('/teacher-dashboard');
                } else {
                    navigate('/dashboard');
                }
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.formWrapper}>
                <div style={styles.formCard}>
                    <div style={styles.header}>
                        <div style={styles.iconCircle}>
                            <span style={styles.icon}>✨</span>
                        </div>
                        <h2 style={styles.title}>Join ExamPrep</h2>
                        <p style={styles.subtitle}>Create your account and start learning</p>
                    </div>

                    {error && (
                        <div style={styles.errorAlert}>
                            <span style={styles.errorIcon}>⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>👤</span>
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="John Doe"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>🆔</span>
                                Username
                            </label>
                            <input
                                type="text"
                                name="userName"
                                value={formData.userName}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="johndoe"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>📧</span>
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="john@example.com"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>🎭</span>
                                I am a:
                            </label>
                            <div style={styles.roleSelection}>
                                <label
                                    style={{
                                        ...styles.roleCard,
                                        ...(formData.role === 'student' ? styles.roleCardActive : {})
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="student"
                                        checked={formData.role === 'student'}
                                        onChange={handleChange}
                                        style={styles.radioInput}
                                    />
                                    <div style={styles.roleIcon}>👨‍🎓</div>
                                    <div style={styles.roleTitle}>Student</div>
                                    <div style={styles.roleDescription}>Take exams & track progress</div>
                                </label>

                                <label
                                    style={{
                                        ...styles.roleCard,
                                        ...(formData.role === 'teacher' ? styles.roleCardActive : {})
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="teacher"
                                        checked={formData.role === 'teacher'}
                                        onChange={handleChange}
                                        style={styles.radioInput}
                                    />
                                    <div style={styles.roleIcon}>👨‍🏫</div>
                                    <div style={styles.roleTitle}>Teacher</div>
                                    <div style={styles.roleDescription}>Create & manage exams</div>
                                </label>
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>🔒</span>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Min. 6 characters"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                <span style={styles.labelIcon}>🔐</span>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={styles.input}
                                placeholder="Re-enter password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.button,
                                opacity: loading ? 0.7 : 1,
                                cursor: loading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {loading ? (
                                <>
                                    <div style={styles.buttonSpinner}></div>
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <span style={styles.buttonIcon}>🚀</span>
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    <div style={styles.footer}>
                        <p style={styles.footerText}>
                            Already have an account?{' '}
                            <Link to="/login" style={styles.link}>
                                Sign in here
                            </Link>
                        </p>
                    </div>
                </div>

                <div style={styles.decorativeCircle1}></div>
                <div style={styles.decorativeCircle2}></div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
    },
    formWrapper: {
        position: 'relative',
        animation: 'fadeInUp 0.6s ease-out'
    },
    formCard: {
        backgroundColor: '#fff',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        width: '100%',
        maxWidth: '560px',
        position: 'relative',
        zIndex: 1,
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    header: {
        textAlign: 'center',
        marginBottom: '2rem'
    },
    iconCircle: {
        width: '80px',
        height: '80px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.5rem',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        animation: 'pulse 2s infinite'
    },
    icon: {
        fontSize: '36px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        marginBottom: '0.5rem'
    },
    subtitle: {
        fontSize: '15px',
        color: '#718096',
        fontWeight: '500'
    },
    errorAlert: {
        backgroundColor: '#fed7d7',
        color: '#9b2c2c',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        border: '1px solid #fc8181',
        animation: 'slideInLeft 0.3s ease-out'
    },
    errorIcon: {
        fontSize: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    label: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#2d3748',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    labelIcon: {
        fontSize: '16px'
    },
    input: {
        padding: '0.875rem 1.125rem',
        fontSize: '15px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontWeight: '500',
        backgroundColor: '#f7fafc'
    },
    roleSelection: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem',
        marginTop: '0.5rem'
    },
    roleCard: {
        flex: 1,
        padding: '1.5rem',
        border: '2px solid #e2e8f0',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        backgroundColor: '#f7fafc',
        position: 'relative'
    },
    roleCardActive: {
        border: '2px solid #667eea',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        transform: 'scale(1.05)',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)'
    },
    radioInput: {
        position: 'absolute',
        opacity: 0,
        cursor: 'pointer'
    },
    roleIcon: {
        fontSize: '36px',
        marginBottom: '0.75rem'
    },
    roleTitle: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '0.25rem'
    },
    roleDescription: {
        fontSize: '12px',
        color: '#718096'
    },
    button: {
        padding: '1rem',
        fontSize: '16px',
        fontWeight: '700',
        color: '#fff',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        marginTop: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease'
    },
    buttonIcon: {
        fontSize: '20px'
    },
    buttonSpinner: {
        width: '20px',
        height: '20px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderTop: '3px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    footer: {
        marginTop: '1.5rem',
        textAlign: 'center',
        paddingTop: '1.5rem',
        borderTop: '1px solid #e2e8f0'
    },
    footerText: {
        fontSize: '14px',
        color: '#718096'
    },
    link: {
        color: '#667eea',
        textDecoration: 'none',
        fontWeight: '700',
        transition: 'all 0.3s ease'
    },
    decorativeCircle1: {
        position: 'absolute',
        width: '300px',
        height: '300px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        top: '-150px',
        right: '-150px',
        zIndex: 0,
        backdropFilter: 'blur(10px)'
    },
    decorativeCircle2: {
        position: 'absolute',
        width: '200px',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        bottom: '-100px',
        left: '-100px',
        zIndex: 0,
        backdropFilter: 'blur(10px)'
    }
};

export default Register;