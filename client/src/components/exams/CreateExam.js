import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI } from '../../services/api';

const CreateExam = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [examData, setExamData] = useState({
        title: '',
        description: '',
        duration: 30,
        totalMarks: 0,
        passingMarks: 0,
        questions: []
    });
    const [currentQuestion, setCurrentQuestion] = useState({
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        marks: 1
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const totalSteps = 3;

    // Step 1: Basic Info Validation
    const validateBasicInfo = () => {
        const newErrors = {};
        if (!examData.title.trim()) newErrors.title = 'Title is required';
        if (!examData.description.trim()) newErrors.description = 'Description is required';
        if (examData.duration < 5) newErrors.duration = 'Duration must be at least 5 minutes';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Step 2: Question Validation
    const validateQuestion = () => {
        const newErrors = {};
        if (!currentQuestion.questionText.trim()) {
            newErrors.questionText = 'Question text is required';
        }
        currentQuestion.options.forEach((opt, idx) => {
            if (!opt.trim()) {
                newErrors[`option${idx}`] = `Option ${idx + 1} is required`;
            }
        });
        if (currentQuestion.marks < 1) {
            newErrors.marks = 'Marks must be at least 1';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleBasicInfoChange = (e) => {
        const { name, value } = e.target;
        setExamData({ ...examData, [name]: value });
        // Clear error for this field
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleQuestionChange = (e) => {
        const { name, value } = e.target;
        setCurrentQuestion({ ...currentQuestion, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
        if (errors[`option${index}`]) {
            const newErrors = { ...errors };
            delete newErrors[`option${index}`];
            setErrors(newErrors);
        }
    };

    const addQuestion = () => {
        if (!validateQuestion()) return;

        const newQuestion = { ...currentQuestion };
        const updatedQuestions = [...examData.questions, newQuestion];
        const totalMarks = updatedQuestions.reduce((sum, q) => sum + parseInt(q.marks), 0);

        setExamData({
            ...examData,
            questions: updatedQuestions,
            totalMarks: totalMarks,
            passingMarks: Math.ceil(totalMarks * 0.4) // 40% passing
        });

        // Reset current question
        setCurrentQuestion({
            questionText: '',
            options: ['', '', '', ''],
            correctOption: 0,
            marks: 1
        });
        setErrors({});
    };

    const removeQuestion = (index) => {
        const updatedQuestions = examData.questions.filter((_, i) => i !== index);
        const totalMarks = updatedQuestions.reduce((sum, q) => sum + parseInt(q.marks), 0);

        setExamData({
            ...examData,
            questions: updatedQuestions,
            totalMarks: totalMarks,
            passingMarks: Math.ceil(totalMarks * 0.4)
        });
    };

    const editQuestion = (index) => {
        setCurrentQuestion(examData.questions[index]);
        removeQuestion(index);
    };

    const nextStep = () => {
        if (currentStep === 1 && !validateBasicInfo()) return;
        if (currentStep === 2 && examData.questions.length === 0) {
            setErrors({ questions: 'Add at least one question' });
            return;
        }
        setCurrentStep(currentStep + 1);
        setErrors({});
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
    };

    // const handleSubmit = async () => {
    //     if (examData.questions.length < 1) {
    //         setErrors({ questions: 'Add at least one question' });
    //         return;
    //     }

    //     setLoading(true);
    //     try {
    //         await examAPI.createExam(examData);
    //         navigate('/teacher-dashboard');
    //     } catch (error) {
    //         console.error('Error creating exam:', error);
    //         setErrors({ submit: 'Failed to create exam. Please try again.' });
    //     } finally {
    //         setLoading(false);
    //     }
    // };



    // Replace the handleSubmit function with this:

    // ...existing code...
    const handleSubmit = async () => {
        if (examData.questions.length < 1) {
            setErrors({ questions: 'Add at least one question' });
            return;
        }

        setLoading(true);

        try {
            // Map questions to match server schema (correctAnswer not correctOption)
            const formattedQuestions = examData.questions.map((q) => ({
                questionText: q.questionText.trim(),
                options: q.options.map(opt => opt.trim()),
                correctAnswer: parseInt(q.correctOption), // ✅ server expects correctAnswer
                marks: parseInt(q.marks)
            }));

            // Server expects: title, description, duration, questions, category
            const payload = {
                title: examData.title.trim(),
                description: examData.description.trim(),
                duration: parseInt(examData.duration),
                category: 'General', // ✅ required by server
                difficulty: 'Medium',
                passingScore: parseInt(examData.passingMarks),
                questions: formattedQuestions
            };

            console.log('✅ Submitting exam:', payload);

            const response = await examAPI.createExam(payload);
            console.log('✅ Exam created:', response.data);

            alert('Exam created successfully!');
            navigate('/teacher-dashboard');

        } catch (error) {
            console.error('❌ Error:', error);
            console.error('Response data:', error.response?.data);
            console.error('Request payload:', error.config?.data);

            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to create exam';
            setErrors({ submit: errorMessage });
            alert(`Error: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
    // ...existing code...

    const renderProgressBar = () => (
        <div style={styles.progressBarContainer}>
            {[1, 2, 3].map((step) => (
                <div key={step} style={styles.progressStep}>
                    <div
                        style={{
                            ...styles.progressCircle,
                            ...(currentStep >= step ? styles.progressCircleActive : {})
                        }}
                    >
                        {currentStep > step ? '✓' : step}
                    </div>
                    <div style={styles.progressLabel}>
                        {step === 1 && 'Basic Info'}
                        {step === 2 && 'Add Questions'}
                        {step === 3 && 'Review & Submit'}
                    </div>
                    {step < 3 && (
                        <div
                            style={{
                                ...styles.progressLine,
                                ...(currentStep > step ? styles.progressLineActive : {})
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );

    const renderStep1 = () => (
        <div style={styles.stepContainer}>
            <div style={styles.stepHeader}>
                <div style={styles.stepIcon}>📝</div>
                <h2 style={styles.stepTitle}>Exam Basic Information</h2>
                <p style={styles.stepSubtitle}>Set up the fundamental details of your exam</p>
            </div>

            <div style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        <span style={styles.labelIcon}>📚</span>
                        Exam Title *
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={examData.title}
                        onChange={handleBasicInfoChange}
                        placeholder="e.g., JavaScript Fundamentals Quiz"
                        style={{
                            ...styles.input,
                            ...(errors.title ? styles.inputError : {})
                        }}
                    />
                    {errors.title && <span style={styles.errorText}>{errors.title}</span>}
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        <span style={styles.labelIcon}>📄</span>
                        Description *
                    </label>
                    <textarea
                        name="description"
                        value={examData.description}
                        onChange={handleBasicInfoChange}
                        placeholder="Describe what this exam covers..."
                        rows="4"
                        style={{
                            ...styles.textarea,
                            ...(errors.description ? styles.inputError : {})
                        }}
                    />
                    {errors.description && <span style={styles.errorText}>{errors.description}</span>}
                </div>

                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>⏱️</span>
                            Duration (minutes) *
                        </label>
                        <input
                            type="number"
                            name="duration"
                            value={examData.duration}
                            onChange={handleBasicInfoChange}
                            min="5"
                            style={{
                                ...styles.input,
                                ...(errors.duration ? styles.inputError : {})
                            }}
                        />
                        {errors.duration && <span style={styles.errorText}>{errors.duration}</span>}
                    </div>

                    <div style={styles.infoCard}>
                        <div style={styles.infoIcon}>💡</div>
                        <div>
                            <div style={styles.infoTitle}>Pro Tip</div>
                            <div style={styles.infoText}>Allow 1-2 minutes per question</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div style={styles.stepContainer}>
            <div style={styles.stepHeader}>
                <div style={styles.stepIcon}>❓</div>
                <h2 style={styles.stepTitle}>Add Questions</h2>
                <p style={styles.stepSubtitle}>
                    Create questions for your exam ({examData.questions.length} added)
                </p>
            </div>

            {/* Current Question Form */}
            <div style={styles.questionForm}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>
                        <span style={styles.labelIcon}>❓</span>
                        Question Text *
                    </label>
                    <textarea
                        name="questionText"
                        value={currentQuestion.questionText}
                        onChange={handleQuestionChange}
                        placeholder="Enter your question here..."
                        rows="3"
                        style={{
                            ...styles.textarea,
                            ...(errors.questionText ? styles.inputError : {})
                        }}
                    />
                    {errors.questionText && <span style={styles.errorText}>{errors.questionText}</span>}
                </div>

                <div style={styles.optionsGrid}>
                    {currentQuestion.options.map((option, index) => (
                        <div key={index} style={styles.optionGroup}>
                            <label style={styles.optionLabel}>
                                <input
                                    type="radio"
                                    checked={currentQuestion.correctOption === index}
                                    onChange={() =>
                                        setCurrentQuestion({ ...currentQuestion, correctOption: index })
                                    }
                                    style={styles.radioInput}
                                />
                                <div style={styles.radioCircle}>
                                    {currentQuestion.correctOption === index && (
                                        <div style={styles.radioCircleInner}></div>
                                    )}
                                </div>
                                <span style={styles.optionNumber}>Option {index + 1}</span>
                                {currentQuestion.correctOption === index && (
                                    <span style={styles.correctBadge}>✓ Correct</span>
                                )}
                            </label>
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                placeholder={`Enter option ${index + 1}...`}
                                style={{
                                    ...styles.optionInput,
                                    ...(errors[`option${index}`] ? styles.inputError : {})
                                }}
                            />
                            {errors[`option${index}`] && (
                                <span style={styles.errorText}>{errors[`option${index}`]}</span>
                            )}
                        </div>
                    ))}
                </div>

                <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>
                            <span style={styles.labelIcon}>🏆</span>
                            Marks for this question
                        </label>
                        <input
                            type="number"
                            name="marks"
                            value={currentQuestion.marks}
                            onChange={handleQuestionChange}
                            min="1"
                            style={styles.input}
                        />
                    </div>
                </div>

                <button onClick={addQuestion} style={styles.addQuestionButton}>
                    <span style={styles.buttonIcon}>➕</span>
                    Add Question
                </button>
            </div>

            {/* Added Questions List */}
            {examData.questions.length > 0 && (
                <div style={styles.addedQuestions}>
                    <h3 style={styles.sectionTitle}>
                        Added Questions ({examData.questions.length})
                    </h3>
                    <div style={styles.questionsList}>
                        {examData.questions.map((question, index) => (
                            <div key={index} style={styles.questionCard}>
                                <div style={styles.questionCardHeader}>
                                    <span style={styles.questionNumber}>Q{index + 1}</span>
                                    <span style={styles.questionMarks}>{question.marks} marks</span>
                                </div>
                                <p style={styles.questionCardText}>{question.questionText}</p>
                                <div style={styles.questionCardOptions}>
                                    {question.options.map((opt, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                ...styles.optionPreview,
                                                ...(idx === question.correctOption
                                                    ? styles.optionPreviewCorrect
                                                    : {})
                                            }}
                                        >
                                            {idx === question.correctOption && '✓ '}
                                            {opt}
                                        </div>
                                    ))}
                                </div>
                                <div style={styles.questionCardActions}>
                                    <button
                                        onClick={() => editQuestion(index)}
                                        style={styles.editQuestionButton}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => removeQuestion(index)}
                                        style={styles.deleteQuestionButton}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {errors.questions && (
                <div style={styles.errorAlert}>
                    <span style={styles.errorIcon}>⚠️</span>
                    {errors.questions}
                </div>
            )}
        </div>
    );

    const renderStep3 = () => (
        <div style={styles.stepContainer}>
            <div style={styles.stepHeader}>
                <div style={styles.stepIcon}>✅</div>
                <h2 style={styles.stepTitle}>Review & Submit</h2>
                <p style={styles.stepSubtitle}>Review your exam before publishing</p>
            </div>

            <div style={styles.reviewContainer}>
                <div style={styles.reviewCard}>
                    <h3 style={styles.reviewCardTitle}>📚 Exam Details</h3>
                    <div style={styles.reviewItem}>
                        <span style={styles.reviewLabel}>Title:</span>
                        <span style={styles.reviewValue}>{examData.title}</span>
                    </div>
                    <div style={styles.reviewItem}>
                        <span style={styles.reviewLabel}>Description:</span>
                        <span style={styles.reviewValue}>{examData.description}</span>
                    </div>
                    <div style={styles.reviewItem}>
                        <span style={styles.reviewLabel}>Duration:</span>
                        <span style={styles.reviewValue}>{examData.duration} minutes</span>
                    </div>
                </div>

                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>❓</div>
                        <div style={styles.statNumber}>{examData.questions.length}</div>
                        <div style={styles.statLabel}>Questions</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>🏆</div>
                        <div style={styles.statNumber}>{examData.totalMarks}</div>
                        <div style={styles.statLabel}>Total Marks</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statIcon}>✅</div>
                        <div style={styles.statNumber}>{examData.passingMarks}</div>
                        <div style={styles.statLabel}>Passing Marks</div>
                    </div>
                </div>

                <div style={styles.reviewCard}>
                    <h3 style={styles.reviewCardTitle}>❓ Questions Summary</h3>
                    {examData.questions.map((question, index) => (
                        <div key={index} style={styles.reviewQuestion}>
                            <div style={styles.reviewQuestionHeader}>
                                <span style={styles.reviewQuestionNumber}>Q{index + 1}</span>
                                <span style={styles.reviewQuestionMarks}>{question.marks} marks</span>
                            </div>
                            <p style={styles.reviewQuestionText}>{question.questionText}</p>
                        </div>
                    ))}
                </div>
            </div>

            {errors.submit && (
                <div style={styles.errorAlert}>
                    <span style={styles.errorIcon}>⚠️</span>
                    {errors.submit}
                </div>
            )}
        </div>
    );

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>
                    <span style={styles.titleIcon}>📝</span>
                    Create New Exam
                </h1>
                <button onClick={() => navigate('/teacher-dashboard')} style={styles.cancelButton}>
                    ← Back to Dashboard
                </button>
            </div>

            {renderProgressBar()}

            <div style={styles.content}>
                {currentStep === 1 && renderStep1()}
                {currentStep === 2 && renderStep2()}
                {currentStep === 3 && renderStep3()}
            </div>

            <div style={styles.navigationButtons}>
                {currentStep > 1 && (
                    <button onClick={prevStep} style={styles.prevStepButton}>
                        ← Previous Step
                    </button>
                )}
                {currentStep < totalSteps ? (
                    <button onClick={nextStep} style={styles.nextStepButton}>
                        Next Step →
                    </button>
                ) : (
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            ...styles.submitButton,
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={styles.buttonSpinner}></div>
                                Creating Exam...
                            </>
                        ) : (
                            <>
                                <span style={styles.buttonIcon}>🚀</span>
                                Publish Exam
                            </>
                        )}
                    </button>
                )}
            </div>
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
        alignItems: 'center',
        marginBottom: '3rem',
        flexWrap: 'wrap',
        gap: '1rem'
    },
    title: {
        fontSize: '36px',
        fontWeight: '900',
        color: '#2d3748',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem'
    },
    titleIcon: {
        fontSize: '40px'
    },
    cancelButton: {
        padding: '0.75rem 1.5rem',
        background: '#f7fafc',
        color: '#4a5568',
        border: 'none',
        borderRadius: '12px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    progressBarContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '3rem',
        position: 'relative'
    },
    progressStep: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
    },
    progressCircle: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: '#e2e8f0',
        color: '#718096',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '800',
        marginBottom: '0.75rem',
        transition: 'all 0.3s ease',
        zIndex: 2
    },
    progressCircleActive: {
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
        transform: 'scale(1.1)'
    },
    progressLabel: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#718096',
        textAlign: 'center'
    },
    progressLine: {
        position: 'absolute',
        top: '30px',
        left: '50%',
        width: '100%',
        height: '4px',
        background: '#e2e8f0',
        zIndex: 1
    },
    progressLineActive: {
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
    },
    content: {
        background: '#fff',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
        marginBottom: '2rem'
    },
    stepContainer: {
        animation: 'fadeInUp 0.4s ease-out'
    },
    stepHeader: {
        textAlign: 'center',
        marginBottom: '3rem'
    },
    stepIcon: {
        fontSize: '64px',
        marginBottom: '1rem'
    },
    stepTitle: {
        fontSize: '32px',
        fontWeight: '900',
        color: '#2d3748',
        marginBottom: '0.5rem'
    },
    stepSubtitle: {
        fontSize: '16px',
        color: '#718096',
        fontWeight: '500'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    formRow: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
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
        fontSize: '18px'
    },
    input: {
        padding: '1rem 1.25rem',
        fontSize: '15px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontWeight: '500',
        backgroundColor: '#f7fafc'
    },
    textarea: {
        padding: '1rem 1.25rem',
        fontSize: '15px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontWeight: '500',
        backgroundColor: '#f7fafc',
        resize: 'vertical',
        fontFamily: 'inherit'
    },
    inputError: {
        borderColor: '#fc8181',
        backgroundColor: '#fff5f5'
    },
    errorText: {
        fontSize: '13px',
        color: '#fc4a1a',
        fontWeight: '600',
        marginTop: '0.25rem'
    },
    infoCard: {
        display: 'flex',
        gap: '1rem',
        padding: '1.5rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        borderRadius: '16px',
        border: '2px solid #667eea'
    },
    infoIcon: {
        fontSize: '32px'
    },
    infoTitle: {
        fontSize: '14px',
        fontWeight: '800',
        color: '#667eea',
        marginBottom: '0.25rem'
    },
    infoText: {
        fontSize: '13px',
        color: '#718096',
        fontWeight: '600'
    },
    questionForm: {
        padding: '2rem',
        background: '#f7fafc',
        borderRadius: '20px',
        marginBottom: '2rem'
    },
    optionsGrid: {
        display: 'grid',
        gap: '1.5rem',
        marginTop: '1.5rem'
    },
    optionGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
    },
    optionLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '0.5rem'
    },
    radioInput: {
        display: 'none'
    },
    radioCircle: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid #cbd5e0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
    },
    radioCircleInner: {
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    optionNumber: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#2d3748'
    },
    correctBadge: {
        fontSize: '12px',
        fontWeight: '800',
        color: '#11998e',
        background: 'rgba(17, 153, 142, 0.1)',
        padding: '0.25rem 0.75rem',
        borderRadius: '8px',
        marginLeft: 'auto'
    },
    optionInput: {
        padding: '0.875rem 1.125rem',
        fontSize: '15px',
        border: '2px solid #e2e8f0',
        borderRadius: '12px',
        outline: 'none',
        transition: 'all 0.3s ease',
        fontWeight: '500',
        backgroundColor: '#fff'
    },
    addQuestionButton: {
        padding: '1rem 2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease',
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        justifyContent: 'center'
    },
    addedQuestions: {
        marginTop: '3rem'
    },
    sectionTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#2d3748',
        marginBottom: '1.5rem'
    },
    questionsList: {
        display: 'grid',
        gap: '1.5rem'
    },
    questionCard: {
        padding: '1.5rem',
        background: '#fff',
        borderRadius: '16px',
        border: '2px solid #e2e8f0',
        transition: 'all 0.3s ease'
    },
    questionCardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1rem'
    },
    questionNumber: {
        fontSize: '14px',
        fontWeight: '800',
        color: '#667eea',
        background: 'rgba(102, 126, 234, 0.1)',
        padding: '0.5rem 1rem',
        borderRadius: '8px'
    },
    questionMarks: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#11998e'
    },
    questionCardText: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#2d3748',
        marginBottom: '1rem',
        lineHeight: '1.6'
    },
    questionCardOptions: {
        display: 'grid',
        gap: '0.5rem',
        marginBottom: '1rem'
    },
    optionPreview: {
        padding: '0.75rem 1rem',
        background: '#f7fafc',
        borderRadius: '10px',
        fontSize: '14px',
        color: '#718096',
        fontWeight: '500'
    },
    optionPreviewCorrect: {
        background: 'rgba(17, 153, 142, 0.1)',
        color: '#11998e',
        fontWeight: '700'
    },
    questionCardActions: {
        display: 'flex',
        gap: '0.75rem',
        paddingTop: '1rem',
        borderTop: '1px solid #e2e8f0'
    },
    editQuestionButton: {
        flex: 1,
        padding: '0.75rem',
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        color: '#667eea',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    deleteQuestionButton: {
        flex: 1,
        padding: '0.75rem',
        background: 'rgba(252, 74, 26, 0.1)',
        color: '#fc4a1a',
        border: 'none',
        borderRadius: '10px',
        fontSize: '14px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    reviewContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
    },
    reviewCard: {
        padding: '2rem',
        background: '#f7fafc',
        borderRadius: '20px',
        border: '2px solid #e2e8f0'
    },
    reviewCardTitle: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#2d3748',
        marginBottom: '1.5rem'
    },
    reviewItem: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1rem',
        alignItems: 'flex-start'
    },
    reviewLabel: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#718096',
        minWidth: '120px'
    },
    reviewValue: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#2d3748',
        flex: 1
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem'
    },
    statCard: {
        padding: '2rem',
        background: '#fff',
        borderRadius: '20px',
        textAlign: 'center',
        border: '2px solid #e2e8f0'
    },
    statIcon: {
        fontSize: '48px',
        marginBottom: '1rem'
    },
    statNumber: {
        fontSize: '36px',
        fontWeight: '900',
        color: '#667eea',
        marginBottom: '0.5rem'
    },
    statLabel: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#718096',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    reviewQuestion: {
        padding: '1.5rem',
        background: '#fff',
        borderRadius: '16px',
        marginBottom: '1rem'
    },
    reviewQuestionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '0.75rem'
    },
    reviewQuestionNumber: {
        fontSize: '14px',
        fontWeight: '800',
        color: '#667eea'
    },
    reviewQuestionMarks: {
        fontSize: '14px',
        fontWeight: '700',
        color: '#11998e'
    },
    reviewQuestionText: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#2d3748',
        lineHeight: '1.6'
    },
    navigationButtons: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '1rem'
    },
    prevStepButton: {
        padding: '1rem 2.5rem',
        background: '#f7fafc',
        color: '#4a5568',
        border: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
    },
    nextStepButton: {
        padding: '1rem 2.5rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
        transition: 'all 0.3s ease',
        marginLeft: 'auto'
    },
    submitButton: {
        padding: '1rem 2.5rem',
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '14px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        boxShadow: '0 10px 30px rgba(17, 153, 142, 0.4)',
        transition: 'all 0.3s ease',
        marginLeft: 'auto',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
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
    errorAlert: {
        backgroundColor: '#fed7d7',
        color: '#9b2c2c',
        padding: '1rem',
        borderRadius: '12px',
        marginTop: '1.5rem',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        border: '1px solid #fc8181'
    },
    errorIcon: {
        fontSize: '20px'
    }
};

export default CreateExam;