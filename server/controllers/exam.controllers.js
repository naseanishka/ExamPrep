import Result from '../models/result.model.js';  // ✅ Add this import
import Exam from '../models/exam.model.js';

// Get all exams
export const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.find()
            .populate('createdBy', 'name userName')
            .select('-questions.correctAnswer'); // Don't send correct answers

        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get single exam (for taking exam)
export const getExamById = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id)
            .populate('createdBy', 'name userName')
            .select('-questions.correctAnswer'); // Don't send correct answers

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        // if (!exam.isActive) {
        //     return res.status(400).json({ message: 'Exam is not active' });
        // }

        res.status(200).json(exam);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Create new exam
export const createExam = async (req, res) => {
    try {
        const { title, description, duration, questions, category, difficulty, passingScore } = req.body;

        if (!title || !description || !duration || !questions || !category) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        if (questions.length === 0) {
            return res.status(400).json({ message: 'Exam must have at least one question' });
        }

        // Validate questions
        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            if (!question.questionText || !question.options || question.options.length < 2) {
                return res.status(400).json({ message: `Question ${i + 1} is invalid` });
            }
            if (question.correctAnswer < 0 || question.correctAnswer >= question.options.length) {
                return res.status(400).json({ message: `Question ${i + 1} has invalid correct answer` });
            }
        }

        const exam = new Exam({
            title,
            description,
            duration,
            totalQuestions: questions.length,
            questions,
            category,
            difficulty: difficulty || 'Medium',
            passingScore: passingScore || 60,
            createdBy: req.user._id
        });

        const savedExam = await exam.save();
        await savedExam.populate('createdBy', 'name userName');

        res.status(201).json(savedExam);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get user's created exams
export const getUserExams = async (req, res) => {
    try {
        const exams = await Exam.find({ createdBy: req.user._id })
            .populate('createdBy', 'name userName');

        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update exam
export const updateExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (exam.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this exam' });
        }

        const updatedExam = await Exam.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('createdBy', 'name userName');

        res.status(200).json(updatedExam);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Delete exam
export const deleteExam = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);

        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }

        if (exam.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this exam' });
        }

        await Exam.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Exam deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};




// ...existing functions...

// ✅ ADD THIS NEW CONTROLLER
export const getMyExams = async (req, res) => {
    try {
        const exams = await Exam.find({ createdBy: req.user._id })
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        // Add attempt count for each exam
        const examsWithStats = await Promise.all(
            exams.map(async (exam) => {
                const attemptCount = await Result.countDocuments({ exam: exam._id });
                return {
                    ...exam.toObject(),
                    attemptCount
                };
            })
        );

        res.json(examsWithStats);
    } catch (error) {
        console.error('Get my exams error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};