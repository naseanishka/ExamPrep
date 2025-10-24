import express from 'express';
import { signIn, signUp, getCurrentUser, signOut } from '../controllers/auth.controllers.js';
import { protect } from '../middleware/auth.middleware.js'; // ← ADD THIS

const router = express.Router();

// Routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/me', protect, getCurrentUser); // ← ADD THIS
router.post('/signout', signOut);

export default router;
