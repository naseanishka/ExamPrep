import Exam from '../models/exam.model.js';
import Result from '../models/result.model.js';

// Submit exam and compute result
export const submitExam = async (req, res) => {
    try {
        const { examId, answers, timeSpent } = req.body;

        if (!examId || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'examId and answers are required' });
        }

        const exam = await Exam.findById(examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        // if (!exam.isActive) {
        //     return res.status(400).json({ message: 'Exam is not active' });
        // }

        const evaluation = [];
        let score = 0;
        let totalPoints = 0;

        // exam.questions.forEach((q, idx) => {
        //     const selected = answers[idx]?.selectedOption;
        //     const isCorrect = typeof selected === 'number' && selected === q.correctAnswer;
        //     const points = q.points ?? 1;

        //     totalPoints += points;
        //     if (isCorrect) score += points;

        //     evaluation.push({
        //         questionId: q._id,
        //         selectedOption: typeof selected === 'number' ? selected : -1,
        //         isCorrect,
        //         points: isCorrect ? points : 0
        //     });
        // });


        for (let idx = 0; idx < exam.questions.length; idx++) {
            const q = exam.questions[idx];

            const points = typeof q.points === 'number' ? q.points : 1;
            totalPoints += points;

            let selected = -1;
            if (answers && answers[idx] && typeof answers[idx].selectedOption === 'number') {
                selected = answers[idx].selectedOption;
            }

            let isCorrect = false;
            if (selected === q.correctAnswer) {
                isCorrect = true;
                score += points;
            }

            evaluation.push({
                questionId: q._id,
                selectedOption: selected,
                isCorrect: isCorrect,
                points: isCorrect ? points : 0
            });
        }

        const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
        const passed = percentage >= (exam.passingScore ?? 60);

        const result = await Result.create({
            user: req.user._id,
            exam: exam._id,
            answers: evaluation,
            score,
            totalPoints,
            percentage,
            passed,
            timeSpent: timeSpent ?? 0,
            completedAt: new Date()
        });

        const populated = await Result.findById(result._id)
            .populate('exam', 'title category difficulty')
            .populate('user', 'name userName');

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get a single result by id (owner-only)
export const getResultById = async (req, res) => {
    try {
        const result = await Result.findById(req.params.id)
            .populate('exam', 'title category difficulty')
            .populate('user', 'name userName');

        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        if (result.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this result' });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get current user's results
export const getMyResults = async (req, res) => {
    try {
        const results = await Result.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate('exam', 'title category difficulty');

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Get results for an exam (creator-only)
export const getExamResults = async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.examId);
        if (!exam) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        if (exam.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view results for this exam' });
        }

        const results = await Result.find({ exam: exam._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name userName');

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};