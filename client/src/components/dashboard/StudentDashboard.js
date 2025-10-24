import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { examAPI, resultAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalExams: 0,
        completedExams: 0,
        averageScore: 0
    });
    const [recentResults, setRecentResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [examsResponse, resultsResponse] = await Promise.all([
                examAPI.getAllExams(),
                resultAPI.getMyResults()
            ]);

            const results = resultsResponse.data;
            const totalScore = results.reduce((sum, result) => sum + result.score, 0);
            const avgScore = results.length > 0 ? (totalScore / results.length).toFixed(1) : 0;

            setStats({
                totalExams: examsResponse.data.length,
                completedExams: results.length,
                averageScore: avgScore
            });

            setRecentResults(results.slice(0, 5));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
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
                        <span style={styles.wave}>👋</span> Welcome back, {user.name}!
                    </h1>
                    <p style={styles.subtitle}>Ready to ace your next exam?</p>
                </div>
            </div>

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
                        <div style={styles.statLabel}>Available Exams</div>
                    </div>
                </div>

                <div style={styles.statCard}>
                    <div style={styles.statIconWrapper}>
                        <div style={{ ...styles.statIconCircle, background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                            <span style={styles.statIcon}>✅</span>
                        </div>
                    </div>
                    <div style={styles.statContent}>
                        <div style={styles.statNumber}>{stats.completedExams}</div>
                        <div style={styles.statLabel}>Completed</div>
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
                        <div style={styles.statLabel}>Average Score</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Quick Actions</h2>
                <div style={styles.actionsGrid}>
                    <Link to="/exams" style={styles.actionCard}>
                        <div style={{ ...styles.actionIconCircle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <span style={styles.actionIcon}>📝</span>
                        </div>
                        <div style={styles.actionContent}>
                            <div style={styles.actionTitle}>Browse Exams</div>
                            <div style={styles.actionDescription}>Find and take available exams</div>
                        </div>
                        <div style={styles.actionArrow}>→</div>
                    </Link>

                    <Link to="/my-results" style={styles.actionCard}>
                        <div style={{ ...styles.actionIconCircle, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <span style={styles.actionIcon}>📊</span>
                        </div>
                        <div style={styles.actionContent}>
                            <div style={styles.actionTitle}>View Results</div>
                            <div style={styles.actionDescription}>Check your exam performance</div>
                        </div>
                        <div style={styles.actionArrow}>→</div>
                    </Link>
                </div>
            </div>

            {/* Recent Results */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Recent Results</h2>
                {recentResults.length > 0 ? (
                    <div style={styles.resultsGrid}>
                        {recentResults.map((result) => (
                            <Link
                                key={result._id}
                                to={`/results/${result._id}`}
                                style={styles.resultCard}
                            >
                                <div style={styles.resultHeader}>
                                    <div style={styles.resultExamTitle}>
                                        {result.exam?.title || 'Exam'}
                                    </div>
                                    <div style={{
                                        ...styles.resultBadge,
                                        background: result.score >= 75
                                            ? 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
                                            : result.score >= 50
                                                ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                                                : 'linear-gradient(135deg, #fc4a1a 0%, #f7b733 100%)'
                                    }}>
                                        {result.score}%
                                    </div>
                                </div>
                                <div style={styles.resultFooter}>
                                    <span style={styles.resultDate}>
                                        📅 {new Date(result.submittedAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                    <span style={styles.resultViewMore}>View Details →</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={styles.emptyState}>
                        <div style={styles.emptyIcon}>📝</div>
                        <p style={styles.emptyText}>No results yet</p>
                        <p style={styles.emptySubtext}>Start taking exams to see your results here</p>
                        <Link to="/exams" style={styles.emptyButton}>
                            Browse Exams
                        </Link>
                    </div>
                )}
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
        marginBottom: '3rem'
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
    sectionTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#2d3748',
        marginBottom: '1.5rem'
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
    actionIcon: {
        fontSize: '28px'
    },
    actionContent: {
        flex: 1
    },
    actionTitle: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '0.25rem'
    },
    actionDescription: {
        fontSize: '14px',
        color: '#718096'
    },
    actionArrow: {
        fontSize: '24px',
        color: '#cbd5e0',
        fontWeight: 'bold'
    },
    resultsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
    },
    resultCard: {
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    resultHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '1rem'
    },
    resultExamTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#2d3748',
        flex: 1
    },
    resultBadge: {
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '800',
        color: '#fff',
        marginLeft: '1rem'
    },
    resultFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '1rem',
        borderTop: '1px solid #e2e8f0'
    },
    resultDate: {
        fontSize: '13px',
        color: '#718096',
        fontWeight: '600'
    },
    resultViewMore: {
        fontSize: '14px',
        color: '#667eea',
        fontWeight: '700'
    },
    emptyState: {
        background: '#fff',
        padding: '4rem 2rem',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
    },
    emptyIcon: {
        fontSize: '64px',
        marginBottom: '1rem'
    },
    emptyText: {
        fontSize: '20px',
        fontWeight: '700',
        color: '#2d3748',
        marginBottom: '0.5rem'
    },
    emptySubtext: {
        fontSize: '16px',
        color: '#718096',
        marginBottom: '2rem'
    },
    emptyButton: {
        display: 'inline-block',
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        borderRadius: '12px',
        textDecoration: 'none',
        fontWeight: '700',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)'
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

// Add wave animation to index.css
const styleSheet = document.createElement("style");
styleSheet.textContent = `
@keyframes wave {
    0%, 100% { transform: rotate(0deg); }
    25% { transform: rotate(20deg); }
    75% { transform: rotate(-20deg); }
}
`;
document.head.appendChild(styleSheet);

export default StudentDashboard;