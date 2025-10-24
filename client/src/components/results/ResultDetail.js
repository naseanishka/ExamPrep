import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultAPI } from '../../services/api';

const ResultDetail = () => {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        fetchResultDetails();
    }, [id]);

    const fetchResultDetails = async () => {
        try {
            const response = await resultAPI.getResultById(id);
            setResult(response.data);

            // Show confetti if passed
            if (response.data.score >= 60) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }
        } catch (err) {
            setError('Failed to load result details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

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
                <Link to="/my-results" style={styles.errorButton}>
                    ← Back to Results
                </Link>
            </div>
        );
    }

    if (!result) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>🔍</div>
                <h2 style={styles.errorTitle}>Result Not Found</h2>
                <p style={styles.errorText}>The result you're looking for doesn't exist.</p>
                <Link to="/my-results" style={styles.errorButton}>
                    ← Back to Results
                </Link>
            </div>
        );
    }

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
        if (score >= 90) return { grade: 'A+', emoji: '🌟', message: 'Outstanding!' };
        if (score >= 80) return { grade: 'A', emoji: '🎉', message: 'Excellent!' };
        if (score >= 70) return { grade: 'B+', emoji: '👏', message: 'Great Job!' };
        if (score >= 60) return { grade: 'B', emoji: '👍', message: 'Good Work!' };
        if (score >= 50) return { grade: 'C', emoji: '📚', message: 'Keep Practicing!' };
        return { grade: 'F', emoji: '💪', message: 'Don\'t Give Up!' };
    };

    const gradeInfo = getGrade(result.score);
    const percentage = result.score;
    const correctPercentage = (result.correctAnswers / (result.answers?.length || 1)) * 100;

    return (
        <div style={styles.container}>
            {showConfetti && <div style={styles.confetti}>🎊</div>}

            {/* Header */}
            <div style={styles.header}>
                <Link to="/my-results" style={styles.backLink}>
                    <span style={styles.backArrow}>←</span> Back to Results
                </Link>
                <h1 style={styles.pageTitle}>
                    <span style={styles.titleIcon}>📊</span>
                    Exam Result Analysis
                </h1>
            </div>

            {/* Score Hero Section */}
            <div style={{
                ...styles.scoreHero,
                background: getGradient(percentage)
            }}>
                <div style={styles.scoreContent}>
                    <div style={styles.emojiLarge}>{gradeInfo.emoji}</div>
                    <h2 style={styles.scoreMessage}>{gradeInfo.message}</h2>

                    <div style={styles.scoreDisplay}>
                        <div style={styles.scoreCircleContainer}>
                            <svg style={styles.progressRing} width="200" height="200">
                                <circle
                                    style={styles.progressRingBg}
                                    cx="100"
                                    cy="100"
                                    r="85"
                                />
                                <circle
                                    style={{
                                        ...styles.progressRingFill,
                                        strokeDashoffset: 534 - (534 * percentage) / 100
                                    }}
                                    cx="100"
                                    cy="100"
                                    r="85"
                                />
                            </svg>
                            <div style={styles.scoreInner}>
                                <div style={styles.scorePercentage}>{percentage}%</div>
                                <div style={styles.scoreGrade}>{gradeInfo.grade}</div>
                            </div>
                        </div>
                    </div>

                    <div style={styles.statsRow}>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>{result.correctAnswers}</div>
                            <div style={styles.statLabel}>Correct</div>
                        </div>
                        <div style={styles.statDivider}></div>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>{result.answers?.length || 0}</div>
                            <div style={styles.statLabel}>Total</div>
                        </div>
                        <div style={styles.statDivider}></div>
                        <div style={styles.statItem}>
                            <div style={styles.statValue}>{result.obtainedMarks}</div>
                            <div style={styles.statLabel}>Marks</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Details Card */}
            <div style={styles.detailsCard}>
                <div style={styles.cardHeader}>
                    <h3 style={styles.cardTitle}>
                        <span style={styles.cardIcon}>📋</span>
                        Exam Details
                    </h3>
                </div>
                <div style={styles.detailsGrid}>
                    <div style={styles.detailItem}>
                        <div style={styles.detailIcon}>📚</div>
                        <div style={styles.detailContent}>
                            <div style={styles.detailLabel}>Exam Title</div>
                            <div style={styles.detailValue}>{result.exam?.title || 'Unknown Exam'}</div>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={styles.detailIcon}>📅</div>
                        <div style={styles.detailContent}>
                            <div style={styles.detailLabel}>Submitted On</div>
                            <div style={styles.detailValue}>
                                {new Date(result.submittedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={styles.detailIcon}>🎯</div>
                        <div style={styles.detailContent}>
                            <div style={styles.detailLabel}>Total Marks</div>
                            <div style={styles.detailValue}>{result.totalMarks} marks</div>
                        </div>
                    </div>
                    <div style={styles.detailItem}>
                        <div style={styles.detailIcon}>⭐</div>
                        <div style={styles.detailContent}>
                            <div style={styles.detailLabel}>Obtained Marks</div>
                            <div style={styles.detailValue}>{result.obtainedMarks} marks</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Breakdown */}
            <div style={styles.performanceCard}>
                <h3 style={styles.cardTitle}>
                    <span style={styles.cardIcon}>📈</span>
                    Performance Breakdown
                </h3>
                <div style={styles.performanceGrid}>
                    <div style={styles.performanceItem}>
                        <div style={styles.performanceBar}>
                            <div style={{
                                ...styles.performanceBarFill,
                                width: `${correctPercentage}%`,
                                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                            }}></div>
                        </div>
                        <div style={styles.performanceLabel}>
                            <span>Correct Answers</span>
                            <span style={{ color: '#10b981', fontWeight: '700' }}>
                                {result.correctAnswers} / {result.answers?.length || 0}
                            </span>
                        </div>
                    </div>
                    <div style={styles.performanceItem}>
                        <div style={styles.performanceBar}>
                            <div style={{
                                ...styles.performanceBarFill,
                                width: `${(result.obtainedMarks / result.totalMarks) * 100}%`,
                                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)'
                            }}></div>
                        </div>
                        <div style={styles.performanceLabel}>
                            <span>Marks Obtained</span>
                            <span style={{ color: '#3b82f6', fontWeight: '700' }}>
                                {result.obtainedMarks} / {result.totalMarks}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Answers Review Section */}
            <div style={styles.answersSection}>
                <div style={styles.sectionHeader}>
                    <h3 style={styles.sectionTitle}>
                        <span style={styles.sectionIcon}>✍️</span>
                        Detailed Answer Review
                    </h3>
                    <div style={styles.legendContainer}>
                        <div style={styles.legendItem}>
                            <div style={{ ...styles.legendDot, background: '#10b981' }}></div>
                            <span style={styles.legendText}>Correct</span>
                        </div>
                        <div style={styles.legendItem}>
                            <div style={{ ...styles.legendDot, background: '#ef4444' }}></div>
                            <span style={styles.legendText}>Incorrect</span>
                        </div>
                    </div>
                </div>

                <div style={styles.answersList}>
                    {result.answers?.map((answer, index) => {
                        const question = result.exam?.questions?.[index];
                        const isCorrect = answer.isCorrect;
                        const selectedOption = question?.options?.[answer.selectedAnswer];
                        const correctOption = question?.options?.[question?.correctAnswer];

                        return (
                            <div
                                key={index}
                                style={{
                                    ...styles.answerCard,
                                    borderLeft: `5px solid ${isCorrect ? '#10b981' : '#ef4444'}`
                                }}
                            >
                                <div style={styles.answerCardHeader}>
                                    <div style={styles.questionNumBadge}>
                                        Question {index + 1}
                                    </div>
                                    <div style={{
                                        ...styles.statusBadge,
                                        background: isCorrect
                                            ? 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)'
                                            : 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                                        color: isCorrect ? '#065f46' : '#991b1b'
                                    }}>
                                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </div>
                                </div>

                                <p style={styles.questionText}>
                                    {question?.questionText || 'Question not available'}
                                </p>

                                <div style={styles.optionsContainer}>
                                    {question?.options?.map((option, optIdx) => {
                                        const isSelected = answer.selectedAnswer === optIdx;
                                        const isCorrectAnswer = question?.correctAnswer === optIdx;

                                        let optionStyle = { ...styles.optionItem };

                                        if (isSelected && isCorrect) {
                                            optionStyle = { ...optionStyle, ...styles.optionCorrect };
                                        } else if (isSelected && !isCorrect) {
                                            optionStyle = { ...optionStyle, ...styles.optionWrong };
                                        } else if (isCorrectAnswer && !isCorrect) {
                                            optionStyle = { ...optionStyle, ...styles.optionShowCorrect };
                                        }

                                        return (
                                            <div key={optIdx} style={optionStyle}>
                                                <div style={styles.optionLetter}>
                                                    {String.fromCharCode(65 + optIdx)}
                                                </div>
                                                <div style={styles.optionText}>{option}</div>
                                                {isSelected && (
                                                    <div style={styles.selectedTag}>Your Answer</div>
                                                )}
                                                {isCorrectAnswer && !isCorrect && (
                                                    <div style={styles.correctTag}>✓ Correct</div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                <div style={styles.marksInfo}>
                                    <div style={styles.marksLabel}>Marks:</div>
                                    <div style={styles.marksValue}>
                                        <span style={{ color: isCorrect ? '#10b981' : '#ef4444', fontWeight: '700' }}>
                                            {isCorrect ? question?.marks : 0}
                                        </span>
                                        <span style={{ color: '#6b7280' }}> / {question?.marks || 0}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Action Buttons */}
            <div style={styles.actionButtons}>
                <Link to="/my-results" style={styles.secondaryButton}>
                    <span style={styles.buttonIcon}>←</span>
                    Back to Results
                </Link>
                <Link to="/exams" style={styles.primaryButton}>
                    <span style={styles.buttonIcon}>🎯</span>
                    Take Another Exam
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #f9fafb 0%, #ffffff 100%)',
        animation: 'fadeIn 0.6s ease-out'
    },
    confetti: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '200px',
        animation: 'confettiBurst 3s ease-out',
        pointerEvents: 'none',
        zIndex: 9999
    },
    header: {
        marginBottom: '2rem'
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
        fontSize: '36px',
        fontWeight: '900',
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        margin: 0
    },
    titleIcon: {
        fontSize: '40px'
    },
    scoreHero: {
        borderRadius: '24px',
        padding: '4rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        overflow: 'hidden'
    },
    scoreContent: {
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
    },
    emojiLarge: {
        fontSize: '80px',
        marginBottom: '1rem',
        animation: 'bounce 2s infinite'
    },
    scoreMessage: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#ffffff',
        marginBottom: '2rem',
        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    scoreDisplay: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '3rem'
    },
    scoreCircleContainer: {
        position: 'relative',
        width: '200px',
        height: '200px'
    },
    progressRing: {
        transform: 'rotate(-90deg)'
    },
    progressRingBg: {
        fill: 'none',
        stroke: 'rgba(255, 255, 255, 0.2)',
        strokeWidth: '12'
    },
    progressRingFill: {
        fill: 'none',
        stroke: '#ffffff',
        strokeWidth: '12',
        strokeLinecap: 'round',
        strokeDasharray: '534',
        transition: 'stroke-dashoffset 1.5s ease-out',
        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
    },
    scoreInner: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center'
    },
    scorePercentage: {
        fontSize: '48px',
        fontWeight: '900',
        color: '#ffffff',
        lineHeight: 1,
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
    },
    scoreGrade: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#ffffff',
        marginTop: '0.5rem',
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
    },
    statsRow: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '3rem'
    },
    statItem: {
        textAlign: 'center'
    },
    statValue: {
        fontSize: '36px',
        fontWeight: '900',
        color: '#ffffff',
        lineHeight: 1,
        textShadow: '0 2px 10px rgba(0,0,0,0.2)'
    },
    statLabel: {
        fontSize: '14px',
        fontWeight: '600',
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    statDivider: {
        width: '2px',
        height: '50px',
        background: 'rgba(255, 255, 255, 0.3)'
    },
    detailsCard: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb'
    },
    cardHeader: {
        marginBottom: '1.5rem'
    },
    cardTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        margin: 0
    },
    cardIcon: {
        fontSize: '28px'
    },
    detailsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
    },
    detailItem: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '1.25rem',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        borderRadius: '16px',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
    },
    detailIcon: {
        fontSize: '32px',
        flexShrink: 0
    },
    detailContent: {
        flex: 1
    },
    detailLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: '0.5rem',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    detailValue: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        lineHeight: 1.4
    },
    performanceCard: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb'
    },
    performanceGrid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        marginTop: '1.5rem'
    },
    performanceItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    performanceBar: {
        width: '100%',
        height: '12px',
        background: '#f3f4f6',
        borderRadius: '999px',
        overflow: 'hidden',
        position: 'relative'
    },
    performanceBarFill: {
        height: '100%',
        borderRadius: '999px',
        transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    },
    performanceLabel: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px',
        color: '#6b7280',
        fontWeight: '600'
    },
    answersSection: {
        marginBottom: '2rem'
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    sectionTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#111827',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        margin: 0
    },
    sectionIcon: {
        fontSize: '32px'
    },
    legendContainer: {
        display: 'flex',
        gap: '1.5rem'
    },
    legendItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    legendDot: {
        width: '12px',
        height: '12px',
        borderRadius: '50%'
    },
    legendText: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#6b7280'
    },
    answersList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    answerCard: {
        background: '#ffffff',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        transition: 'all 0.3s ease'
    },
    answerCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
    },
    questionNumBadge: {
        fontSize: '14px',
        fontWeight: '800',
        color: '#3b82f6',
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    statusBadge: {
        fontSize: '14px',
        fontWeight: '800',
        padding: '0.5rem 1rem',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
    },
    questionText: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        lineHeight: 1.7,
        marginBottom: '1.5rem'
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        marginBottom: '1.5rem'
    },
    optionItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        background: '#f9fafb',
        borderRadius: '12px',
        border: '2px solid #e5e7eb',
        transition: 'all 0.3s ease',
        position: 'relative'
    },
    optionCorrect: {
        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
        borderColor: '#10b981',
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
    },
    optionWrong: {
        background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
        borderColor: '#ef4444',
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)'
    },
    optionShowCorrect: {
        background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
        borderColor: '#3b82f6',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
    },
    optionLetter: {
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: '800',
        color: '#374151',
        flexShrink: 0,
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    },
    optionText: {
        flex: 1,
        fontSize: '15px',
        fontWeight: '600',
        color: '#374151',
        lineHeight: 1.5
    },
    selectedTag: {
        fontSize: '12px',
        fontWeight: '800',
        color: '#6b7280',
        background: '#ffffff',
        padding: '0.375rem 0.75rem',
        borderRadius: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    correctTag: {
        fontSize: '12px',
        fontWeight: '800',
        color: '#065f46',
        background: '#ffffff',
        padding: '0.375rem 0.75rem',
        borderRadius: '8px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
    },
    marksInfo: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 1.25rem',
        background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
        borderRadius: '12px',
        border: '1px solid #e5e7eb'
    },
    marksLabel: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#6b7280',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    marksValue: {
        fontSize: '18px',
        fontWeight: '800'
    },
    actionButtons: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingTop: '2rem'
    },
    secondaryButton: {
        flex: 1,
        minWidth: '200px',
        padding: '1rem 2rem',
        background: '#ffffff',
        color: '#374151',
        textDecoration: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        textAlign: 'center',
        border: '2px solid #e5e7eb',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    },
    primaryButton: {
        flex: 1,
        minWidth: '200px',
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
        color: '#ffffff',
        textDecoration: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.3)',
        border: 'none'
    },
    buttonIcon: {
        fontSize: '20px'
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

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-20px); }
    }
    @keyframes confettiBurst {
        0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.5); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
    }
`;
document.head.appendChild(styleSheet);

export default ResultDetail;