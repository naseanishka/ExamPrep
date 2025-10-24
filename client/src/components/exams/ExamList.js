// Fetch all available exams from the API
// Display them in a card layout
// Show exam details (title, duration, difficulty, questions count)
// Allow users to click "Take Exam" button


import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { examAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ExamList = () => {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        filterAndSortExams();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [exams, searchTerm, sortBy]);

    const fetchExams = async () => {
        try {
            const response = await examAPI.getAllExams();
            setExams(response.data);
            setFilteredExams(response.data);
        } catch (err) {
            setError('Failed to load exams');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const filterAndSortExams = () => {
        let filtered = [...exams];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(exam =>
                exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                exam.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort
        if (sortBy === 'recent') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else if (sortBy === 'questions') {
            filtered.sort((a, b) => (b.questions?.length || 0) - (a.questions?.length || 0));
        }

        setFilteredExams(filtered);
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading exams...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>
                        <span style={styles.titleIcon}>📚</span>
                        Available Exams
                    </h1>
                    <p style={styles.subtitle}>Browse and take exams to test your knowledge</p>
                </div>
            </div>

            {error && (
                <div style={styles.errorAlert}>
                    <span style={styles.errorIcon}>⚠️</span>
                    {error}
                </div>
            )}

            {/* Search and Filter Bar */}
            <div style={styles.filterBar}>
                <div style={styles.searchWrapper}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search exams by title or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.sortWrapper}>
                    <span style={styles.sortLabel}>Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={styles.sortSelect}
                    >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                        <option value="questions">Most Questions</option>
                    </select>
                </div>
            </div>

            {/* Results Count */}
            <div style={styles.resultsCount}>
                <span style={styles.countText}>
                    {filteredExams.length} {filteredExams.length === 1 ? 'exam' : 'exams'} found
                </span>
            </div>

            {/* Exams Grid */}
            {filteredExams.length > 0 ? (
                <div style={styles.examsGrid}>
                    {filteredExams.map((exam) => (
                        <Link
                            key={exam._id}
                            to={`/exams/${exam._id}`}
                            style={styles.examCard}
                        >
                            <div style={styles.examHeader}>
                                <div style={styles.examIconCircle}>
                                    <span style={styles.examIcon}>📝</span>
                                </div>
                                <div style={styles.examBadge}>
                                    {exam.questions?.length || 0} Questions
                                </div>
                            </div>

                            <h3 style={styles.examTitle}>{exam.title}</h3>
                            <p style={styles.examDescription}>
                                {exam.description.length > 120
                                    ? exam.description.substring(0, 120) + '...'
                                    : exam.description}
                            </p>

                            <div style={styles.examMeta}>
                                <div style={styles.metaItem}>
                                    <span style={styles.metaIcon}>👨‍🏫</span>
                                    <span style={styles.metaText}>
                                        {exam.createdBy?.name || 'Unknown'}
                                    </span>
                                </div>
                                <div style={styles.metaItem}>
                                    <span style={styles.metaIcon}>⏱️</span>
                                    <span style={styles.metaText}>{exam.duration} min</span>
                                </div>
                                <div style={styles.metaItem}>
                                    <span style={styles.metaIcon}>📊</span>
                                    <span style={styles.metaText}>{exam.totalMarks} marks</span>
                                </div>
                            </div>

                            <div style={styles.examFooter}>
                                <span style={styles.viewDetailsText}>View Details →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div style={styles.emptyState}>
                    <div style={styles.emptyIcon}>🔍</div>
                    <h3 style={styles.emptyTitle}>No exams found</h3>
                    <p style={styles.emptyText}>
                        {searchTerm
                            ? 'Try adjusting your search terms'
                            : 'No exams available at the moment'}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            style={styles.clearButton}
                        >
                            Clear Search
                        </button>
                    )}
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
    titleIcon: {
        fontSize: '48px'
    },
    subtitle: {
        fontSize: '18px',
        color: '#718096',
        fontWeight: '500'
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
    filterBar: {
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    searchWrapper: {
        flex: 1,
        minWidth: '300px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: '#fff',
        borderRadius: '14px',
        padding: '1rem 1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        border: '2px solid transparent',
        transition: 'all 0.3s ease'
    },
    searchIcon: {
        fontSize: '20px',
        marginRight: '1rem'
    },
    searchInput: {
        flex: 1,
        border: 'none',
        outline: 'none',
        fontSize: '15px',
        fontWeight: '500',
        color: '#2d3748',
        backgroundColor: 'transparent'
    },
    sortWrapper: {
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        background: '#fff',
        padding: '1rem 1.5rem',
        borderRadius: '14px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
    },
    sortLabel: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#718096',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    sortSelect: {
        border: 'none',
        outline: 'none',
        fontSize: '15px',
        fontWeight: '600',
        color: '#2d3748',
        backgroundColor: 'transparent',
        cursor: 'pointer'
    },
    resultsCount: {
        marginBottom: '1.5rem'
    },
    countText: {
        fontSize: '15px',
        color: '#718096',
        fontWeight: '600'
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
        textDecoration: 'none',
        transition: 'all 0.3s ease',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        display: 'block'
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
        marginBottom: '1.5rem',
        minHeight: '48px'
    },
    examMeta: {
        display: 'flex',
        flexWrap: 'wrap',
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
    examFooter: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    viewDetailsText: {
        fontSize: '15px',
        color: '#667eea',
        fontWeight: '700',
        transition: 'all 0.3s ease'
    },
    emptyState: {
        background: '#fff',
        padding: '5rem 2rem',
        borderRadius: '20px',
        textAlign: 'center',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        marginTop: '2rem'
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
    clearButton: {
        padding: '0.75rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease'
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

export default ExamList;