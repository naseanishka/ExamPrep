import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { examAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ExamDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [exam, setExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchExamDetails();
    }, [id]);

    const fetchExamDetails = async () => {
        try {
            const response = await examAPI.getExamById(id);
            setExam(response.data);
        } catch (err) {
            setError('Failed to load exam details');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStartExam = () => {
        navigate(`/exams/${id}/take`);
    };

    const handleEdit = () => {
        navigate(`/exams/${id}/edit`);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await examAPI.deleteExam(id);
                alert('Exam deleted successfully');
                navigate('/teacher-dashboard');
            } catch (err) {
                alert('Failed to delete exam');
                console.error(err);
            }
        }
    };

    if (loading) {
        return <div style={styles.loading}>Loading exam details...</div>;
    }

    if (error) {
        return <div style={styles.error}>{error}</div>;
    }

    if (!exam) {
        return <div style={styles.error}>Exam not found</div>;
    }

    const isTeacher = user?.role === 'teacher';
    const isCreator = exam.createdBy?._id === user?.id;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>{exam.title}</h1>
                    <p style={styles.description}>{exam.description}</p>
                </div>
                {isTeacher && isCreator && (
                    <div style={styles.actions}>
                        <button onClick={handleEdit} style={styles.editButton}>
                            ✏️ Edit
                        </button>
                        <button onClick={handleDelete} style={styles.deleteButton}>
                            🗑️ Delete
                        </button>
                    </div>
                )}
            </div>

            <div style={styles.infoCard}>
                <div style={styles.infoGrid}>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Duration:</span>
                        <span style={styles.infoValue}>{exam.duration} minutes</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Total Questions:</span>
                        <span style={styles.infoValue}>{exam.questions?.length || 0}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Total Marks:</span>
                        <span style={styles.infoValue}>{exam.totalMarks}</span>
                    </div>
                    <div style={styles.infoItem}>
                        <span style={styles.infoLabel}>Created By:</span>
                        <span style={styles.infoValue}>
                            {exam.createdBy?.name || 'Unknown'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Questions Preview */}
            <div style={styles.questionsSection}>
                <h2 style={styles.sectionTitle}>Questions Overview</h2>
                <div style={styles.questionsList}>
                    {exam.questions?.map((question, index) => (
                        <div key={question._id || index} style={styles.questionCard}>
                            <div style={styles.questionHeader}>
                                <span style={styles.questionNumber}>Q{index + 1}</span>
                                <span style={styles.questionMarks}>{question.marks} marks</span>
                            </div>
                            <p style={styles.questionText}>{question.questionText}</p>
                            <div style={styles.optionsList}>
                                {question.options?.map((option, optIndex) => (
                                    <div key={optIndex} style={styles.option}>
                                        <span style={styles.optionLabel}>
                                            {String.fromCharCode(65 + optIndex)}.
                                        </span>
                                        <span style={styles.optionText}>{option}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Start Exam Button (Students Only) */}
            {!isTeacher && (
                <div style={styles.startSection}>
                    <button onClick={handleStartExam} style={styles.startButton}>
                        🚀 Start Exam
                    </button>
                </div>
            )}

            <div style={styles.backSection}>
                <Link to="/exams" style={styles.backButton}>
                    ← Back to Exams
                </Link>
            </div>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '2rem'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem'
    },
    title: {
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '0.5rem'
    },
    description: {
        fontSize: '16px',
        color: '#666',
        lineHeight: '1.6'
    },
    actions: {
        display: 'flex',
        gap: '1rem'
    },
    editButton: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    deleteButton: {
        padding: '10px 20px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600'
    },
    infoCard: {
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem'
    },
    infoItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    infoLabel: {
        fontSize: '14px',
        color: '#666',
        fontWeight: '500'
    },
    infoValue: {
        fontSize: '18px',
        color: '#333',
        fontWeight: '600'
    },
    questionsSection: {
        marginBottom: '2rem'
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '1.5rem'
    },
    questionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
    },
    questionCard: {
        backgroundColor: '#fff',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    questionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    questionNumber: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#007bff'
    },
    questionMarks: {
        fontSize: '14px',
        color: '#666',
        backgroundColor: '#f0f0f0',
        padding: '4px 12px',
        borderRadius: '12px'
    },
    questionText: {
        fontSize: '16px',
        color: '#333',
        marginBottom: '1rem',
        lineHeight: '1.6'
    },
    optionsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    },
    option: {
        display: 'flex',
        gap: '0.75rem',
        padding: '0.75rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
    },
    optionLabel: {
        fontWeight: '600',
        color: '#007bff',
        minWidth: '30px'
    },
    optionText: {
        color: '#333',
        flex: 1
    },
    startSection: {
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '2rem'
    },
    startButton: {
        padding: '16px 48px',
        backgroundColor: '#28a745',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '18px',
        fontWeight: 'bold',
        boxShadow: '0 4px 12px rgba(40, 167, 69, 0.3)',
        transition: 'transform 0.2s'
    },
    backSection: {
        display: 'flex',
        justifyContent: 'center'
    },
    backButton: {
        color: '#007bff',
        textDecoration: 'none',
        fontSize: '16px',
        fontWeight: '600'
    },
    loading: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '18px',
        color: '#666'
    },
    error: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
        padding: '1rem',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '16px'
    }
};

export default ExamDetail;