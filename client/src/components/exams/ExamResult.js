import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resultAPI, examAPI } from '../../services/api';

const ExamResult = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [result, setResult] = useState(null);
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchResult();
    }, [id]);

    const fetchResult = async () => {
        try {
            console.log('🔄 Fetching result:', id);
            const resultResponse = await resultAPI.getResultById(id);
            console.log('✅ Result data:', resultResponse.data);

            const resultData = resultResponse.data;
            setResult(resultData);

            // Fetch full exam data to show questions and correct answers
            const examResponse = await examAPI.getExamById(resultData.exam._id);
            console.log('✅ Exam data:', examResponse.data);
            setExam(examResponse.data);

            setLoading(false);
        } catch (err) {
            console.error('❌ Error fetching result:', err);
            setError('Failed to load result');
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={styles.container}>
                <div style={styles.loading}>
                    <h2>Loading results...</h2>
                </div>
            </div>
        );
    }

    if (error || !result) {
        return (
            <div style={styles.container}>
                <div style={styles.error}>
                    <h2>❌ {error || 'Result not found'}</h2>
                    <button onClick={() => navigate('/dashboard')} style={styles.button}>
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const passed = result.passed;

    return (
        <div style={styles.container}>
            <div style={{
                ...styles.header,
                backgroundColor: passed ? '#d4edda' : '#f8d7da',
                borderColor: passed ? '#28a745' : '#dc3545'
            }}>
                <div style={styles.statusIcon}>
                    {passed ? '🎉' : '😔'}
                </div>
                <h1 style={{
                    ...styles.title,
                    color: passed ? '#155724' : '#721c24'
                }}>
                    {passed ? 'Congratulations!' : 'Better Luck Next Time!'}
                </h1>
                <p style={{
                    ...styles.subtitle,
                    color: passed ? '#155724' : '#721c24'
                }}>
                    {passed ? 'You have passed the exam!' : 'You did not pass this time.'}
                </p>
            </div>

            <div style={styles.statsContainer}>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{result.score}</div>
                    <div style={styles.statLabel}>Score</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>{result.totalPoints}</div>
                    <div style={styles.statLabel}>Total Points</div>
                </div>
                <div style={styles.statCard}>
                    <div style={{
                        ...styles.statValue,
                        color: passed ? '#28a745' : '#dc3545'
                    }}>
                        {result.percentage}%
                    </div>
                    <div style={styles.statLabel}>Percentage</div>
                </div>
                <div style={styles.statCard}>
                    <div style={styles.statValue}>
                        {Math.floor(result.timeSpent / 60)}:{String(result.timeSpent % 60).padStart(2, '0')}
                    </div>
                    <div style={styles.statLabel}>Time Taken</div>
                </div>
            </div>

            {exam && exam.questions && (
                <div style={styles.reviewSection}>
                    <h2 style={styles.reviewTitle}>Answer Review</h2>
                    {exam.questions.map((question, index) => {
                        const userAnswer = result.answers[index];
                        const isCorrect = userAnswer?.isCorrect;
                        const selectedOption = userAnswer?.selectedOption;

                        return (
                            <div key={index} style={styles.questionCard}>
                                <div style={styles.questionHeader}>
                                    <span style={styles.questionNumber}>Question {index + 1}</span>
                                    <span style={{
                                        ...styles.badge,
                                        backgroundColor: isCorrect ? '#d4edda' : '#f8d7da',
                                        color: isCorrect ? '#155724' : '#721c24'
                                    }}>
                                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                    </span>
                                </div>

                                <p style={styles.questionText}>{question.questionText}</p>

                                <div style={styles.optionsContainer}>
                                    {question.options.map((option, optIndex) => {
                                        const isUserSelection = selectedOption === optIndex;
                                        const isCorrectAnswer = question.correctAnswer === optIndex;

                                        let backgroundColor = '#fff';
                                        let borderColor = '#e0e0e0';
                                        let color = '#333';

                                        if (isCorrectAnswer) {
                                            backgroundColor = '#d4edda';
                                            borderColor = '#28a745';
                                            color = '#155724';
                                        } else if (isUserSelection && !isCorrect) {
                                            backgroundColor = '#f8d7da';
                                            borderColor = '#dc3545';
                                            color = '#721c24';
                                        }

                                        return (
                                            <div
                                                key={optIndex}
                                                style={{
                                                    ...styles.option,
                                                    backgroundColor,
                                                    borderColor,
                                                    color
                                                }}
                                            >
                                                <span style={styles.optionLetter}>
                                                    {String.fromCharCode(65 + optIndex)}
                                                </span>
                                                <span style={styles.optionText}>{option}</span>
                                                {isCorrectAnswer && (
                                                    <span style={styles.correctMark}>✓ Correct Answer</span>
                                                )}
                                                {isUserSelection && !isCorrect && (
                                                    <span style={styles.wrongMark}>Your Answer</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div style={styles.actions}>
                <button
                    onClick={() => navigate('/dashboard')}
                    style={styles.button}
                >
                    Back to Dashboard
                </button>
                <button
                    onClick={() => navigate('/exams')}
                    style={{ ...styles.button, backgroundColor: '#007bff' }}
                >
                    Browse More Exams
                </button>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '20px'
    },
    loading: {
        textAlign: 'center',
        padding: '60px',
        fontSize: '18px',
        color: '#666'
    },
    error: {
        textAlign: 'center',
        padding: '60px',
        fontSize: '18px',
        color: '#dc3545'
    },
    header: {
        textAlign: 'center',
        padding: '40px',
        borderRadius: '12px',
        border: '2px solid',
        marginBottom: '30px'
    },
    statusIcon: {
        fontSize: '60px',
        marginBottom: '16px'
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '8px'
    },
    subtitle: {
        fontSize: '18px',
        fontWeight: '500'
    },
    statsContainer: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },
    statCard: {
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        textAlign: 'center'
    },
    statValue: {
        fontSize: '36px',
        fontWeight: '700',
        color: '#007bff',
        marginBottom: '8px'
    },
    statLabel: {
        fontSize: '14px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    reviewSection: {
        marginBottom: '30px'
    },
    reviewTitle: {
        fontSize: '24px',
        fontWeight: '700',
        marginBottom: '20px'
    },
    questionCard: {
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    questionNumber: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#666',
        textTransform: 'uppercase'
    },
    badge: {
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: '600'
    },
    questionText: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '16px',
        lineHeight: '1.6'
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    option: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px',
        borderRadius: '8px',
        border: '2px solid',
        transition: 'all 0.2s'
    },
    optionLetter: {
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        backgroundColor: 'rgba(0,0,0,0.1)',
        fontWeight: '700',
        flexShrink: 0
    },
    optionText: {
        flex: 1,
        fontSize: '16px'
    },
    correctMark: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#28a745'
    },
    wrongMark: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#dc3545'
    },
    actions: {
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        marginTop: '40px'
    },
    button: {
        padding: '14px 32px',
        backgroundColor: '#6c757d',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    }
};

export default ExamResult;