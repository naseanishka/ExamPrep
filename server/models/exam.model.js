import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // in minutes
        required: true
    },
    totalQuestions: {
        type: Number,
        required: true
    },
    passingScore: {
        type: Number,
        required: true,
        default: 60
    },
    questions: [{
        questionText: {
            type: String,
            required: true
        },
        options: [{
            type: String,
            required: true
        }],
        correctAnswer: {
            type: Number, // index of correct option (0, 1, 2, 3)
            required: true
        },
        points: {
            type: Number,
            default: 1
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        default: 'Medium'
    }
}, {
    timestamps: true
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;