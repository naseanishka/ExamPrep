import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { resultAPI } from '../../services/api';

const MyResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('all'); // all, passed, failed
    const [sortBy, setSortBy] = useState('recent'); // recent, score-high, score-low

    useEffect(() => {
        fetchMyResults();
    }, []);

    const fetchMyResults = async () => {
        try {
            const response = await resultAPI.getMyResults();
            setResults(response.data);
        } catch (err) {
            setError('Failed to load results');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredAndSortedResults = () => {
        let filtered = [...results];

        // Apply filter
        if (filter === 'passed') {
            filtered = filtered.filter(r => r.score >= 60);
        } else if (filter === 'failed') {
            filtered = filtered.filter(r => r.score < 60);
        }

        // Apply sorting
        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
        } else if (sortBy === 'score-high') {
            filtered.sort((a, b) => b.score - a.score);
        } else if (sortBy === 'score-low') {
            filtered.sort((a, b) => a.score - b.score);
        }

        return filtered;
    };

    const calculateStats = () => {
        if (results.length === 0) return { total: 0, passed: 0, failed: 0, avgScore: 0 };

        const passed = results.filter(r => r.score >= 60).length;
        const failed = results.length - passed;
        const avgScore = Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length);

        return { total: results.length, passed, failed, avgScore };
    };

    const getScoreColor = (score) => {
        if (score >= 75) return '#10b981';
        if (score >= 50) return '#f59e0b';
        return '#ef4444';
    };

    const getGradient = (score) => {
        if (score >= 75) return 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        if (score >= 50) return 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        return 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
    };

    const getGrade = (score) => {
        if (score >= 90) return 'A+';
        if (score >= 80) return 'A';
        if (score >= 70) return 'B+';
        if (score >= 60) return 'B';
        if (score >= 50) return 'C';
        return 'F';
    };

    const stats = calculateStats();
    const filteredResults = getFilteredAndSortedResults();

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading your results...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>⚠️</div>
                <h2 style={styles.errorTitle}>Oops!</h2>
                <p style={styles.errorText}>{error}</p>
                <Link to="/student-dashboard" style={styles.errorButton}>
                    ← Back to Dashboard
                </Link>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div>
                    <Link to="/student-dashboard" style={styles.backLink}>
                        <span style={styles.backArrow}>←</span> Back to Dashboard
                    </Link>
                    <h1 style={styles.pageTitle}>
                        <span style={styles.titleIcon}>📊</span>
                        My Exam Results
                    </h1>
                    <p style={styles.pageSubtitle}>
                        Track your performance and improve your skills
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            {results.length > 0 && (
                <div style={styles.statsContainer}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>📝</div>
                        <div style={styles.statContent}>
                            <div style={styles.statValue}>{stats.total}</div>
                            <div style={styles.statLabel}>Total Exams</div>
                        </div>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                        border: '2px solid #10b981'
                    }}>
                        <div style={styles.statIcon}>✅</div>
                        <div style={styles.statContent}>
                            <div style={{ ...styles.statValue, color: '#065f46' }}>{stats.passed}</div>
                            <div style={{ ...styles.statLabel, color: '#047857' }}>Passed</div>
                        </div>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                        border: '2px solid #ef4444'
                    }}>
                        <div style={styles.statIcon}>❌</div>
                        <div style={styles.statContent}>
                            <div style={{ ...styles.statValue, color: '#991b1b' }}>{stats.failed}</div>
                            <div style={{ ...styles.statLabel, color: '#dc2626' }}>Failed</div>
                        </div>
                    </div>
                    <div style={{
                        ...styles.statCard,
                        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                        border: '2px solid #3b82f6'
                    }}>
                        <div style={styles.statIcon}>🎯</div>
                        <div style={styles.statContent}>
                            <div style={{ ...styles.statValue, color: '#1e40af' }}>{stats.avgScore}%</div>
                            <div style={{ ...styles.statLabel, color: '#2563eb' }}>Average Score</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters and Sort */}
            {results.length > 0 && (
                <div style={styles.controlsContainer}>
                    <div style={styles.filterGroup}>
                        <div style={styles.controlLabel}>
                            <span style={styles.controlIcon}>🔍</span>
                            Filter:
                        </div>
                        <div style={styles.filterButtons}>
                            <button
                                onClick={() => setFilter('all')}
                                style={{
                                    ...styles.filterButton,
                                    ...(filter === 'all' ? styles.filterButtonActive : {})
                                }}
                            >
                                All ({results.length})
                            </button>
                            <button
                                onClick={() => setFilter('passed')}
                                style={{
                                    ...styles.filterButton,
                                    ...(filter === 'passed' ? styles.filterButtonActivePassed : {})
                                }}
                            >
                                ✓ Passed ({stats.passed})
                            </button>
                            <button
                                onClick={() => setFilter('failed')}
                                style={{
                                    ...styles.filterButton,
                                    ...(filter === 'failed' ? styles.filterButtonActiveFailed : {})
                                }}
                            >
                                ✗ Failed ({stats.failed})
                            </button>
                        </div>
                    </div>

                    <div style={styles.sortGroup}>
                        <div style={styles.controlLabel}>
                            <span style={styles.controlIcon}>📊</span>
                            Sort By:
                        </div>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            style={styles.sortSelect}
                        >
                            <option value="recent">Most Recent</option>
                            <option value="score-high">Highest Score</option>
                            <option value="score-low">Lowest Score</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Results List */}
            {filteredResults.length === 0 ? (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>
                        {results.length === 0 ? '📭' : '🔍'}
                    </div>
                    <h2 style={styles.emptyTitle}>
                        {results.length === 0 ? 'No Results Yet' : 'No Results Found'}
                    </h2>
                    <p style={styles.emptyText}>
                        {results.length === 0
                            ? "You haven't taken any exams yet. Start taking exams to see your results here!"
                            : 'Try adjusting your filters to see more results.'}
                    </p>
                    {results.length === 0 && (
                        <Link to="/exams" style={styles.emptyButton}>
                            <span style={styles.buttonIcon}>🎯</span>
                            Browse Exams
                        </Link>
                    )}
                </div>
            ) : (
                <div style={styles.resultsGrid}>
                    {filteredResults.map((result, index) => {
                        const score = result.score;
                        const isPassed = score >= 60;
                        const grade = getGrade(score);

                        return (
                            <div
                                key={result._id}
                                style={{
                                    ...styles.resultCard,
                                    animation: `slideInUp 0.5s ease-out ${index * 0.1}s both`
                                }}
                            >
                                {/* Card Header with Score Badge */}
                                <div style={styles.cardHeader}>
                                    <div
                                        style={{
                                            ...styles.scoreBadge,
                                            background: getGradient(score)
                                        }}
                                    >
                                        <div style={styles.scoreBadgeValue}>{score}%</div>
                                        <div style={styles.scoreBadgeGrade}>{grade}</div>
                                    </div>
                                    <div
                                        style={{
                                            ...styles.statusBadge,
                                            background: isPassed
                                                ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                                                : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                            color: isPassed ? '#065f46' : '#991b1b'
                                        }}
                                    >
                                        {isPassed ? '✓ Passed' : '✗ Failed'}
                                    </div>
                                </div>

                                {/* Exam Title */}
                                <h3 style={styles.examTitle}>
                                    {result.exam?.title || 'Exam Title'}
                                </h3>

                                {/* Stats Grid */}
                                <div style={styles.cardStats}>
                                    <div style={styles.cardStat}>
                                        <div style={styles.cardStatIcon}>✓</div>
                                        <div style={styles.cardStatContent}>
                                            <div style={styles.cardStatValue}>
                                                {result.correctAnswers}/{result.answers?.length || 0}
                                            </div>
                                            <div style={styles.cardStatLabel}>Correct</div>
                                        </div>
                                    </div>
                                    <div style={styles.cardStat}>
                                        <div style={styles.cardStatIcon}>🏆</div>
                                        <div style={styles.cardStatContent}>
                                            <div style={styles.cardStatValue}>
                                                {result.obtainedMarks}/{result.totalMarks}
                                            </div>
                                            <div style={styles.cardStatLabel}>Marks</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div style={styles.progressContainer}>
                                    <div style={styles.progressBar}>
                                        <div
                                            style={{
                                                ...styles.progressFill,
                                                width: `${score}%`,
                                                background: getGradient(score)
                                            }}
                                        ></div>
                                    </div>
                                    <div style={styles.progressLabel}>
                                        <span style={styles.progressText}>Performance</span>
                                        <span style={{ ...styles.progressValue, color: getScoreColor(score) }}>
                                            {score}%
                                        </span>
                                    </div>
                                </div>

                                {/* Date */}
                                <div style={styles.cardDate}>
                                    <span style={styles.dateIcon}>📅</span>
                                    {new Date(result.submittedAt).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>

                                {/* Action Button */}
                                <Link
                                    to={`/results/${result._id}`}
                                    style={styles.viewDetailsButton}
                                >
                                    <span style={styles.buttonIcon}>👁️</span>
                                    View Details
                                    <span style={styles.buttonArrow}>→</span>
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Bottom Action */}
            {results.length > 0 && (
                <div style={styles.bottomAction}>
                    <Link to="/exams" style={styles.takeExamButton}>
                        <span style={styles.buttonIcon}>🎯</span>
                        Take Another Exam
                        <span style={styles.buttonArrow}>→</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
        animation: 'fadeIn 0.6s ease-out'
    },
    header: {
        marginBottom: '3rem'
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#6b7280',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: '600',
        marginBottom: '1rem',
        transition: 'all 0.3s ease'
    },
    backArrow: {
        fontSize: '20px',
        transition: 'transform 0.3s ease'
    },
    pageTitle: {
        fontSize: '42px',
        fontWeight: '900',
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        margin: '0 0 0.5rem 0'
    },
    titleIcon: {
        fontSize: '48px'
    },
    pageSubtitle: {
        fontSize: '18px',
        color: '#6b7280',
        fontWeight: '500',
        margin: 0
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem'
    },
    statCard: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '2px solid #e5e7eb',
        transition: 'all 0.3s ease'
    },
    statIcon: {
        fontSize: '48px',
        flexShrink: 0
    },
    statContent: {
        flex: 1
    },
    statValue: {
        fontSize: '36px',
        fontWeight: '900',
        color: '#111827',
        lineHeight: 1
    },
    statLabel: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#6b7280',
        marginTop: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    controlsContainer: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '2px solid #e5e7eb',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    filterGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        flex: 1
    },
    sortGroup: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center'
    },
    controlLabel: {
        fontSize: '15px',
        fontWeight: '800',
        color: '#374151',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    controlIcon: {
        fontSize: '20px'
    },
    filterButtons: {
        display: 'flex',
        gap: '0.75rem',
        flexWrap: 'wrap'
    },
    filterButton: {
        padding: '0.75rem 1.5rem',
        background: '#f9fafb',
        color: '#374151',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        whiteSpace: 'nowrap'
    },
    filterButtonActive: {
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        borderColor: '#3b82f6',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
    },
    filterButtonActivePassed: {
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#ffffff',
        borderColor: '#10b981',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
    },
    filterButtonActiveFailed: {
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: '#ffffff',
        borderColor: '#ef4444',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
    },
    sortSelect: {
        padding: '0.75rem 1.5rem',
        background: '#f9fafb',
        color: '#374151',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        outline: 'none',
        transition: 'all 0.3s ease'
    },
    resultsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
    },
    resultCard: {
        background: '#ffffff',
        borderRadius: '24px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '2px solid #e5e7eb',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1rem'
    },
    scoreBadge: {
        borderRadius: '16px',
        padding: '1rem 1.5rem',
        minWidth: '100px',
        textAlign: 'center',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
    },
    scoreBadgeValue: {
        fontSize: '32px',
        fontWeight: '900',
        color: '#ffffff',
        lineHeight: 1,
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    scoreBadgeGrade: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#ffffff',
        marginTop: '0.25rem',
        textShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    statusBadge: {
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '800',
        whiteSpace: 'nowrap'
    },
    examTitle: {
        fontSize: '22px',
        fontWeight: '800',
        color: '#111827',
        margin: 0,
        lineHeight: 1.4,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    cardStats: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1rem'
    },
    cardStat: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        borderRadius: '16px',
        border: '1px solid #e5e7eb'
    },
    cardStatIcon: {
        fontSize: '28px',
        flexShrink: 0
    },
    cardStatContent: {
        flex: 1
    },
    cardStatValue: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#111827',
        lineHeight: 1
    },
    cardStatLabel: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#6b7280',
        marginTop: '0.25rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    progressContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    progressBar: {
        width: '100%',
        height: '10px',
        background: '#f3f4f6',
        borderRadius: '999px',
        overflow: 'hidden',
        position: 'relative'
    },
    progressFill: {
        height: '100%',
        borderRadius: '999px',
        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    },
    progressLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    progressText: {
        fontSize: '13px',
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    progressValue: {
        fontSize: '16px',
        fontWeight: '800'
    },
    cardDate: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '14px',
        fontWeight: '600',
        color: '#6b7280',
        padding: '0.75rem 1rem',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
    },
    dateIcon: {
        fontSize: '18px'
    },
    viewDetailsButton: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        padding: '1rem 1.5rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '14px',
        fontSize: '15px',
        fontWeight: '700',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
        border: 'none',
        cursor: 'pointer'
    },
    buttonIcon: {
        fontSize: '18px'
    },
    buttonArrow: {
        fontSize: '16px',
        transition: 'transform 0.3s ease',
        marginLeft: 'auto'
    },
    emptyState: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '6rem 2rem',
        textAlign: 'center'
    },
    emptyIcon: {
        fontSize: '120px',
        marginBottom: '1.5rem',
        animation: 'float 3s ease-in-out infinite'
    },
    emptyTitle: {
        fontSize: '32px',
        fontWeight: '900',
        color: '#111827',
        marginBottom: '0.75rem'
    },
    emptyText: {
        fontSize: '18px',
        color: '#6b7280',
        marginBottom: '2rem',
        maxWidth: '500px',
        lineHeight: 1.6
    },
    emptyButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
        transition: 'all 0.3s ease'
    },
    bottomAction: {
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '2rem'
    },
    takeExamButton: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem 3rem',
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '16px',
        fontSize: '18px',
        fontWeight: '800',
        boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)',
        transition: 'all 0.3s ease'
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        gap: '1.5rem'
    },
    spinner: {
        width: '60px',
        height: '60px',
        border: '4px solid #e5e7eb',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    },
    loadingText: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#6b7280'
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '80vh',
        textAlign: 'center',
        padding: '2rem'
    },
    errorIcon: {
        fontSize: '80px',
        marginBottom: '1rem'
    },
    errorTitle: {
        fontSize: '32px',
        fontWeight: '900',
        color: '#111827',
        marginBottom: '0.5rem'
    },
    errorText: {
        fontSize: '18px',
        color: '#6b7280',
        marginBottom: '2rem',
        maxWidth: '500px'
    },
    errorButton: {
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)'
    }
};
// ...existing code...

// Replace the styleSheet section at the bottom with this improved version:

// Add CSS animations and hover effects
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    
    /* Hover effects - Using data attributes instead of class names */
    [data-card="result"]:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    [data-button="view-details"]:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
    }
    
    [data-button="view-details"]:hover [data-arrow="true"] {
        transform: translateX(4px);
    }
    
    [data-button="take-exam"]:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(16, 185, 129, 0.5);
    }
    
    [data-link="back"]:hover {
        color: #3b82f6;
    }
    
    [data-link="back"]:hover [data-back-arrow="true"] {
        transform: translateX(-4px);
    }
    
    [data-card="stat"]:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
    }
    
    [data-button="filter"]:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    [data-select="sort"]:hover {
        border-color: #3b82f6;
        background: #ffffff;
    }
    
    [data-button="empty"]:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 30px rgba(59, 130, 246, 0.4);
    }
`;
document.head.appendChild(styleSheet);

export default MyResults;