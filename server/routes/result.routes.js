import express from 'express';
import { protect, studentOnly } from '../middleware/auth.middleware.js';  // ✅ Add studentOnly
import {
    submitExam,
    getMyResults,
    getResultById
} from '../controllers/result.controllers.js';

const router = express.Router();

// ✅ STUDENT ONLY ROUTES - Only students can submit exams and view results
router.post('/', protect, studentOnly, submitExam);           // Submit exam
router.get('/my', protect, studentOnly, getMyResults);        // Get my results
router.get('/:id', protect, studentOnly, getResultById);      // Get result by ID

export default router;