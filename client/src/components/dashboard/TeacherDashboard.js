import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { examAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TeacherDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myExams, setMyExams] = useState([]);
    const [stats, setStats] = useState({
        totalExams: 0,
        totalStudents: 0,
        averageScore: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyExams();
    }, []);

    const fetchMyExams = async () => {
        try {
            const response = await examAPI.getMyExams();
            const exams = response.data;
            setMyExams(exams);

            // Calculate stats
            const totalStudents = exams.reduce((sum, exam) => sum + (exam.submissions?.length || 0), 0);

            setStats({
                totalExams: exams.length,
                totalStudents: totalStudents,
                averageScore: 0 // You can calculate this from results if needed
            });
        } catch (err) {
            setError('Failed to load your exams');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteExam = async (examId, examTitle) => {
        if (window.confirm(`Are you sure you want to delete "${examTitle}"?`)) {
            try {
                await examAPI.deleteExam(examId);
                setMyExams(myExams.filter(exam => exam._id !== examId));
                setStats(prev => ({ ...prev, totalExams: prev.totalExams - 1 }));
            } catch (err) {
                alert('Failed to delete exam');
                console.error(err);
            }
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        <span style={styles.wave}>👋</span> Welcome, Professor {user.name}!
                    </h1>
                    <p style={styles.subtitle}>Manage your exams and track student performance</p>
                </div>
                <Link to="/create-exam" style={styles.createButton}>
                    <span style={styles.buttonIcon}>➕</span>
                    Create New Exam
                </Link>
            </div>

            {error && (
                <div style={styles.errorAlert}>
                    <span style={styles.errorIcon}>⚠️</span>
                    {error}
                </div>
            )}

            {/* Stats Cards */}
            <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                    <div style={styles.statIconWrapper}>
                        <div style={{ ...styles.statIconCircle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <span style={styles.statIcon}>📚</span>
                        </div>
                    </div>
                    <div style={styles.statContent}>
                        <div style={styles.statNumber}>{stats.totalExams}</div>
                        <div style={styles.statLabel}>Total Exams</div>
                    </div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statIconWrapper}>
                        <div style={{ ...styles.statIconCircle, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                            <span style={styles.statIcon}>👥</span>
                        </div>
                    </div>
                    <div style={styles.statContent}>
                        <div style={styles.statNumber}>{stats.totalStudents}</div>
                        <div style={styles.statLabel}>Total Submissions</div>
                    </div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statIconWrapper}>
                        <div style={{ ...styles.statIconCircle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <span style={styles.statIcon}>⭐</span>
                        </div>
                    </div>
                    <div style={styles.statContent}>
                        <div style={styles.statNumber}>{stats.averageScore}%</div>
                        <div style={styles.statLabel}>Avg Performance</div>
                    </div>
                </div>
            </div>

            {/* My Exams Section */}
            <div style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>My Exams</h2>
                    <div style={styles.examCount}>{myExams.length} exams</div>
                </div>

                {myExams.length > 0 ? (
                    <div style={styles.examsGrid}>
                        {myExams.map((exam) => (
                            <div key={exam._id} style={styles.examCard}>
                                <div style={styles.examHeader}>
                                    <div style={styles.examIconCircle}>
                                        <span style={styles.examIcon}>📝</span>
                                    </div>
                                    <div style={styles.examBadge}>
                                        {exam.questions?.length || 0} Questions
                                    </div>
                                </div>

                                <h3 style={styles.examTitle}>{exam.title}</h3>
                                <p style={styles.examDescription}>{exam.description}</p>

                                <div style={styles.examMeta}>
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaIcon}>⏱️</span>
                                        <span style={styles.metaText}>{exam.duration} min</span>
                                    </div>
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaIcon}>📊</span>
                                        <span style={styles.metaText}>{exam.totalMarks} marks</span>
                                    </div>
                                    <div style={styles.metaItem}>
                                        <span style={styles.metaIcon}>👥</span>
                                        <span style={styles.metaText}>{exam.submissions?.length || 0} submissions</span>
                                    </div>
                                </div>

                                <div style={styles.examActions}>
                                    <Link
                                        to={`/exams/${exam._id}`}
                                        style={styles.actionButton}
                                    >
                                        <span style={styles.actionIcon}>👁️</span>
                                        View
                                    </Link>
                                    <button
                                        onClick={() => navigate(`/exams/${exam._id}/edit`)}
                                        style={{ ...styles.actionButton, ...styles.editButton }}
                                    >
                                        <span style={styles.actionIcon}>✏️</span>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteExam(exam._id, exam.title)}
                                        style={{ ...styles.actionButton, ...styles.deleteButton }}
                                    >
                                        <span style={styles.actionIcon}>🗑️</span>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📝</div>
                        <h3 style={styles.emptyTitle}>No exams created yet</h3>
                        <p style={styles.emptyText}>Create your first exam to get started</p>
                        <Link to="/create-exam" style={styles.emptyButton}>
                            <span style={styles.buttonIcon}>➕</span>
                            Create Your First Exam
                        </Link>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.actionsGrid}>
                    <Link to="/create-exam" style={styles.actionCard}>
                        <div style={{ ...styles.actionIconCircle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <span style={styles.actionCardIcon}>➕</span>
                        </div>
                        <div style={styles.actionCardContent}>
                            <div style={styles.actionCardTitle}>Create Exam</div>
                            <div style={styles.actionCardDescription}>Design a new examination</div>
                        </div>
                        <div style={styles.actionArrow}>→</div>
                    </Link>

                    <Link to="/exams" style={styles.actionCard}>
                        <div style={{ ...styles.actionIconCircle, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                            <span style={styles.actionCardIcon}>📚</span>
                        </div>
                        <div style={styles.actionCardContent}>
                            <div style={styles.actionCardTitle}>Browse All Exams</div>
                            <div style={styles.actionCardDescription}>View all available exams</div>
                        </div>
                        <div style={styles.actionArrow}>→</div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        animation: 'fadeInUp 0.6s ease-out'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1.5rem'
    },
    title: {
        fontSize: '40px',
        fontWeight: '900',
        color: '#2d3748',
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    wave: {
        display: 'inline-block',
        animation: 'wave 2s ease-in-out infinite',
        fontSize: '48px'
    },
    subtitle: {
        fontSize: '18px',
        color: '#718096',
        fontWeight: '500'
    },
    createButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: '14px',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '700',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease'
    },
    buttonIcon: {
        fontSize: '20px'
    },
    errorAlert: {
        backgroundColor: '#fed7d7',
        color: '#9b2c2c',
        padding: '1rem',
        borderRadius: '12px',
        marginBottom: '2rem',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        border: '1px solid #fc8181'
    },
    errorIcon: {
        fontSize: '20px'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
    },
    statCard: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    statIconWrapper: {
        flexShrink: 0
    },
    statIconCircle: {
        width: '70px',
        height: '70px',
        borderRadius: '18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
    },
    statIcon: {
        fontSize: '32px'
    },
    statContent: {
        flex: 1
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: '800',
        color: '#2d3748',
        marginBottom: '0.25rem'
    },
    statLabel: {
        fontSize: '14px',
        color: '#718096',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    section: {
        marginBottom: '3rem'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
    },
    sectionTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#2d3748'
    },
    examCount: {
        fontSize: '14px',
        color: '#718096',
        fontWeight: '600',
        padding: '0.5rem 1rem',
        background: '#f7fafc',
        borderRadius: '8px'
    },
    examsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '2rem'
    },
    examCard: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    examHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
    },
    examIconCircle: {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
    },
    examIcon: {
        fontSize: '28px'
    },
    examBadge: {
        padding: '0.5rem 1rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        color: '#667eea',
        borderRadius: '12px',
        fontSize: '13px',
        fontWeight: '700'
    },
    examTitle: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#2d3748',
        marginBottom: '0.75rem'
    },
    examDescription: {
        fontSize: '15px',
        color: '#718096',
        lineHeight: '1.6',
        marginBottom: '1.5rem'
    },
    examMeta: {
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '1.5rem',
        paddingBottom: '1.5rem',
        borderBottom: '1px solid #e2e8f0'
    },
    metaItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    metaIcon: {
        fontSize: '16px'
    },
    metaText: {
        fontSize: '14px',
        color: '#718096',
        fontWeight: '600'
    },
    examActions: {
        display: 'flex',
        gap: '0.75rem'
    },
    actionButton: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.5rem',
        padding: '0.75rem',
        background: '#f7fafc',
        color: '#4a5568',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '700',
        textDecoration: 'none',
        transition: 'all 0.3s ease'
    },
    editButton: {
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        color: '#667eea'
    },
    deleteButton: {
        background: 'linear-gradient(135deg, rgba(252, 74, 26, 0.1) 0%, rgba(247, 183, 51, 0.1) 100%)',
        color: '#fc4a1a'
    },
    actionIcon: {
        fontSize: '16px'
    },
    emptyState: {
        background: '#fff',
        padding: '5rem 2rem',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
    },
    emptyIcon: {
        fontSize: '80px',
        marginBottom: '1.5rem',
        opacity: 0.5
    },
    emptyTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#2d3748',
        marginBottom: '0.75rem'
    },
    emptyText: {
        fontSize: '16px',
        color: '#718096',
        marginBottom: '2rem'
    },
    emptyButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 2.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: '14px',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '700',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease'
    },
    actionsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
    },
    actionCard: {
        background: '#fff',
        padding: '2rem',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    actionIconCircle: {
        width: '60px',
        height: '60px',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
    },
    actionCardIcon: {
        fontSize: '28px'
    },
    actionCardContent: {
        flex: 1
    },
    actionCardTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '0.25rem'
    },
    actionCardDescription: {
        fontSize: '14px',
        color: '#718096'
    },
    actionArrow: {
        fontSize: '24px',
        color: '#cbd5e0',
        fontWeight: 'bold'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '60vh'
    },
    spinner: {
        width: '60px',
        height: '60px',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #667eea',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    loadingText: {
        marginTop: '1.5rem',
        color: '#718096',
        fontSize: '16px',
        fontWeight: '600'
    }
};

export default TeacherDashboard;