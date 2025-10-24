import axios from 'axios';

// Default to backend dev port if no env provided
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3002/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Auth API calls
export const authAPI = {
    signup: (userData) => api.post('/auth/signup', userData),
    register: (userData) => api.post('/auth/signup', userData),  // ✅ ADD THIS
    signin: (userData) => api.post('/auth/signin', userData),
    login: (userData) => api.post('/auth/signin', userData),      // ✅ ADD THIS
    getCurrentUser: () => api.get('/auth/me'),
};

// Exam API calls
export const examAPI = {
    getAllExams: () => api.get('/exams'),
    getExamById: (id) => api.get(`/exams/${id}`),
    createExam: (examData) => api.post('/exams', examData),
    getMyExams: () => api.get('/exams/my-exams'),
    updateExam: (id, examData) => api.put(`/exams/${id}`, examData),
    deleteExam: (examId) => api.delete(`/exams/${examId}`)
};

// Result API calls
export const resultAPI = {
    submitExam: (resultData) => api.post('/results/submit', resultData),
    getMyResults: () => api.get('/results/my'),
    getResultById: (id) => api.get(`/results/${id}`),
    getExamResults: (examId) => api.get(`/results/exam/${examId}`),
};

export default api;