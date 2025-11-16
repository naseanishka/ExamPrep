import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examAPI, resultAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const TakeExam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

    useEffect(() => {
        fetchExamData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    useEffect(() => {
        if (timeRemaining > 0) {
            const timer = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timeRemaining]);

    const fetchExamData = async () => {
        try {
            const response = await examAPI.getExamById(id);
            setExam(response.data);
            setTimeRemaining(response.data.duration * 60);

            const initialAnswers = {};
            response.data.questions.forEach((q, index) => {
                initialAnswers[index] = '';
            });
            setAnswers(initialAnswers);
        } catch (error) {
            console.error('Error fetching exam:', error);
            alert('Failed to load exam');
            navigate('/exams');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, optionIndex) => {
        setAnswers({
            ...answers,
            [questionIndex]: optionIndex
        });
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        try {
            const submissionData = {
                // Backend expects `examId` and an answers array (aligned with question order)
                examId: exam._id,
                answers: exam.questions.map((q, idx) => {
                    const selected = typeof answers[idx] === 'number' ? answers[idx] : (answers[idx] !== '' ? parseInt(answers[idx]) : -1);
                    return { selectedOption: typeof selected === 'number' && !Number.isNaN(selected) ? selected : -1 };
                }),
                timeSpent: (exam.duration * 60) - timeRemaining
            };

            const response = await resultAPI.submitExam(submissionData);
            navigate(`/results/${response.data._id}`);
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('Failed to submit exam. Please try again.');
        } finally {
            setSubmitting(false);
            setShowConfirmSubmit(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimeColor = () => {
        if (timeRemaining > 300) return '#11998e';
        if (timeRemaining > 60) return '#f093fb';
        return '#fc4a1a';
    };

    const answeredCount = Object.values(answers).filter(a => a !== '').length;
    const progress = (answeredCount / (exam?.questions?.length || 1)) * 100;

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading exam...</p>
            </div>
        );
    }

    if (!exam) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}>❌</div>
                <h2 style={styles.errorTitle}>Exam not found</h2>
                <button onClick={() => navigate('/exams')} style={styles.backButton}>
                    Back to Exams
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* Header with Timer */}
            <div style={styles.header}>
                <div style={styles.examInfo}>
                    <h1 style={styles.examTitle}>{exam.title}</h1>
                    <div style={styles.examMeta}>
                        <span style={styles.metaItem}>
                            📝 Question {currentQuestion + 1} of {exam.questions.length}
                        </span>
                        <span style={styles.metaItem}>
                            ✅ {answeredCount} answered
                        </span>
                    </div>
                </div>

                <div style={{ ...styles.timerCard, borderColor: getTimeColor() }}>
                    <div style={styles.timerIcon}>⏱️</div>
                    <div>
                        <div style={styles.timerLabel}>Time Remaining</div>
                        <div style={{ ...styles.timerValue, color: getTimeColor() }}>
                            {formatTime(timeRemaining)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                    <div style={{ ...styles.progressFill, width: `${progress}%` }}></div>
                </div>
                <span style={styles.progressText}>
                    {Math.round(progress)}% Complete
                </span>
            </div>

            {/* Question Card */}
            <div style={styles.questionCard}>
                <div style={styles.questionHeader}>
                    <div style={styles.questionNumber}>
                        Question {currentQuestion + 1}
                    </div>
                    <div style={styles.questionPoints}>
                        {exam.questions[currentQuestion].marks} {exam.questions[currentQuestion].marks === 1 ? 'mark' : 'marks'}
                    </div>
                </div>

                <h2 style={styles.questionText}>
                    {exam.questions[currentQuestion].questionText}
                </h2>

                <div style={styles.optionsContainer}>
                    {exam.questions[currentQuestion].options.map((option, index) => (
                        <label
                            key={index}
                            style={{
                                ...styles.optionLabel,
                                ...(answers[currentQuestion] === index ? styles.optionLabelSelected : {})
                            }}
                        >
                            <input
                                type="radio"
                                name={`question-${currentQuestion}`}
                                checked={answers[currentQuestion] === index}
                                onChange={() => handleAnswerChange(currentQuestion, index)}
                                style={styles.radioInput}
                            />
                            <div style={styles.optionCircle}>
                                {answers[currentQuestion] === index && (
                                    <div style={styles.optionCircleInner}></div>
                                )}
                            </div>
                            <span style={styles.optionText}>{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Question Navigation */}
            <div style={styles.questionNav}>
                {exam.questions.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentQuestion(index)}
                        style={{
                            ...styles.navButton,
                            ...(currentQuestion === index ? styles.navButtonActive : {}),
                            ...(answers[index] !== '' ? styles.navButtonAnswered : {})
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Navigation Buttons */}
            <div style={styles.controls}>
                <button
                    onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                    disabled={currentQuestion === 0}
                    style={{
                        ...styles.controlButton,
                        ...styles.prevButton,
                        opacity: currentQuestion === 0 ? 0.5 : 1
                    }}
                >
                    ← Previous
                </button>

                {currentQuestion < exam.questions.length - 1 ? (
                    <button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        style={{ ...styles.controlButton, ...styles.nextButton }}
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        onClick={() => setShowConfirmSubmit(true)}
                        style={{ ...styles.controlButton, ...styles.submitButton }}
                    >
                        <span style={styles.buttonIcon}>✅</span>
                        Submit Exam
                    </button>
                )}
            </div>

            {/* Confirm Submit Modal */}
            {showConfirmSubmit && (
                <div style={styles.modal}>
                    <div style={styles.modalContent}>
                        <div style={styles.modalIcon}>⚠️</div>
                        <h2 style={styles.modalTitle}>Submit Exam?</h2>
                        <p style={styles.modalText}>
                            You have answered {answeredCount} out of {exam.questions.length} questions.
                        </p>
                        <p style={styles.modalWarning}>
                            You cannot change your answers after submission!
                        </p>
                        <div style={styles.modalButtons}>
                            <button
                                onClick={() => setShowConfirmSubmit(false)}
                                style={styles.modalCancelButton}
                                disabled={submitting}
                            >
                                Review Answers
                            </button>
                            <button
                                onClick={handleSubmit}
                                style={styles.modalConfirmButton}
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <div style={styles.buttonSpinner}></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Confirm Submit'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem',
        animation: 'fadeInUp 0.6s ease-out'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem',
        gap: '2rem',
        flexWrap: 'wrap'
    },
    examInfo: {
        flex: 1
    },
    examTitle: {
        fontSize: '32px',
        fontWeight: '900',
        color: '#2d3748',
        marginBottom: '1rem'
    },
    examMeta: {
        display: 'flex',
        gap: '2rem',
        flexWrap: 'wrap'
    },
    metaItem: {
        fontSize: '15px',
        color: '#718096',
        fontWeight: '600'
    },
    timerCard: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: '#fff',
        padding: '1.5rem 2rem',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        border: '3px solid',
        minWidth: '200px'
    },
    timerIcon: {
        fontSize: '36px'
    },
    timerLabel: {
        fontSize: '12px',
        color: '#718096',
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        marginBottom: '0.25rem'
    },
    timerValue: {
        fontSize: '32px',
        fontWeight: '900',
        fontFamily: 'monospace'
    },
    progressContainer: {
        marginBottom: '2rem'
    },
    progressBar: {
        height: '12px',
        background: '#e2e8f0',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '0.5rem'
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        transition: 'width 0.3s ease',
        borderRadius: '10px'
    },
    progressText: {
        fontSize: '14px',
        color: '#718096',
        fontWeight: '600'
    },
    questionCard: {
        background: '#fff',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        marginBottom: '2rem',
        border: '1px solid rgba(0, 0, 0, 0.05)'
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '2px solid #e2e8f0'
    },
    questionNumber: {
        fontSize: '16px',
        fontWeight: '800',
        color: '#667eea',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    questionPoints: {
        padding: '0.5rem 1rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        color: '#667eea',
        borderRadius: '12px',
        fontSize: '14px',
        fontWeight: '700'
    },
    questionText: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#2d3748',
        lineHeight: '1.6',
        marginBottom: '2.5rem'
    },
    optionsContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
    },
    optionLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1.25rem 1.5rem',
        background: '#f7fafc',
        borderRadius: '16px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent'
    },
    optionLabelSelected: {
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        border: '2px solid #667eea',
        transform: 'scale(1.02)'
    },
    radioInput: {
        display: 'none'
    },
    optionCircle: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid #cbd5e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        flexShrink: 0
    },
    optionCircleInner: {
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    optionText: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2d3748',
        flex: 1
    },
    questionNav: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.75rem',
        marginBottom: '2rem',
        padding: '2rem',
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)'
    },
    navButton: {
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        border: '2px solid #e2e8f0',
        background: '#fff',
        fontSize: '16px',
        fontWeight: '700',
        color: '#718096',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    navButtonActive: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: '2px solid #667eea',
        transform: 'scale(1.1)'
    },
    navButtonAnswered: {
        background: '#e6fffa',
        border: '2px solid #11998e',
        color: '#11998e'
    },
    controls: {
        display: 'flex',
        gap: '1rem',
        justifyContent: 'space-between'
    },
    controlButton: {
        padding: '1rem 2.5rem',
        fontSize: '16px',
        fontWeight: '700',
        borderRadius: '14px',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
    },
    prevButton: {
        background: '#f7fafc',
        color: '#4a5568'
    },
    nextButton: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
    },
    submitButton: {
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#fff',
        boxShadow: '0 10px 30px rgba(17, 153, 142, 0.4)'
    },
    buttonIcon: {
        fontSize: '20px'
    },
    modal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeIn 0.3s ease-out'
    },
    modalContent: {
        background: '#fff',
        padding: '3rem',
        borderRadius: '24px',
        maxWidth: '500px',
        textAlign: 'center',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        animation: 'fadeInUp 0.3s ease-out'
    },
    modalIcon: {
        fontSize: '64px',
        marginBottom: '1.5rem'
    },
    modalTitle: {
        fontSize: '28px',
        fontWeight: '900',
        color: '#2d3748',
        marginBottom: '1rem'
    },
    modalText: {
        fontSize: '16px',
        color: '#718096',
        marginBottom: '1rem',
        lineHeight: '1.6'
    },
    modalWarning: {
        fontSize: '14px',
        color: '#fc4a1a',
        fontWeight: '700',
        marginBottom: '2rem',
        padding: '1rem',
        background: 'rgba(252, 74, 26, 0.1)',
        borderRadius: '12px'
    },
    modalButtons: {
        display: 'flex',
        gap: '1rem'
    },
    modalCancelButton: {
        flex: 1,
        padding: '1rem',
        background: '#f7fafc',
        color: '#4a5568',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    modalConfirmButton: {
        flex: 1,
        padding: '1rem',
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(17, 153, 142, 0.4)',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
    },
    buttonSpinner: {
        width: '18px',
        height: '18px',
        border: '3px solid rgba(255, 255, 255, 0.3)',
        borderTop: '3px solid #fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
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
    },
    errorContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '60vh',
        textAlign: 'center'
    },
    errorIcon: {
        fontSize: '80px',
        marginBottom: '1.5rem'
    },
    errorTitle: {
        fontSize: '28px',
        fontWeight: '800',
        color: '#2d3748',
        marginBottom: '2rem'
    },
    backButton: {
        padding: '1rem 2.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)'
    }
};

export default TakeExam;