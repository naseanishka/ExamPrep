import express from 'express';
import { protect, teacherOnly, studentOnly } from '../middleware/auth.middleware.js';
import {
    getAllExams,
    getExamById,
    createExam,
    getMyExams,
    updateExam,
    deleteExam
} from '../controllers/exam.controllers.js';

const router = express.Router();

// ✅ SPECIFIC ROUTES FIRST (before /:id)
router.get('/my-exams', protect, teacherOnly, getMyExams);  // ✅ Move this UP

// ✅ TEACHER ONLY ROUTES
router.post('/', protect, teacherOnly, createExam);         // Create exam
router.put('/:id', protect, teacherOnly, updateExam);       // Edit exam
router.delete('/:id', protect, teacherOnly, deleteExam);    // Delete exam

// ✅ PUBLIC ROUTES (after specific routes)
router.get('/', getAllExams);                               // Browse all exams
router.get('/:id', getExamById);                            // View exam details (LAST!)

export default router;