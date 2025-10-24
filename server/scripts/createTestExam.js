import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const createTestExam = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/examprep';
        console.log('🔍 Connecting to:', mongoURI);
        await mongoose.connect(mongoURI);
        console.log('✅ Connected to MongoDB');

        // Define User Schema (simple version for script)
        const userSchema = new mongoose.Schema({
            name: String,
            userName: String,
            email: String,
            password: String
        });

        // Define Exam Schema
        const examSchema = new mongoose.Schema({
            title: String,
            description: String,
            duration: Number,
            difficulty: String,
            passingScore: Number,
            questions: [{
                questionText: String,
                options: [String],
                correctAnswer: Number
            }],
            createdBy: mongoose.Schema.Types.ObjectId,
            createdAt: Date
        });

        // Get or create models
        const User = mongoose.models.User || mongoose.model('User', userSchema);
        const Exam = mongoose.models.Exam || mongoose.model('Exam', examSchema);

        // Find a user
        const user = await User.findOne();

        if (!user) {
            console.log('❌ No user found! Please register a user first at http://localhost:3001/register');
            process.exit(1);
        }

        console.log('👤 Found user:', user.userName);

        // Create exam
        const exam = await Exam.create({
            title: 'JavaScript Basics Quiz',
            description: 'Test your JavaScript fundamentals',
            duration: 15,
            difficulty: 'easy',
            passingScore: 60,
            questions: [
                {
                    questionText: "What is JavaScript?",
                    options: [
                        "A programming language",
                        "A coffee brand",
                        "A framework",
                        "A database"
                    ],
                    correctAnswer: 0
                },
                {
                    questionText: "Which keyword declares a variable?",
                    options: ["variable", "var", "v", "int"],
                    correctAnswer: 1
                },
                {
                    questionText: "How to write an array?",
                    options: [
                        "var arr = (1,2,3)",
                        "var arr = '1,2,3'",
                        "var arr = [1,2,3]",
                        "var arr = {1,2,3}"
                    ],
                    correctAnswer: 2
                },
                {
                    questionText: "How to show an alert?",
                    options: [
                        "alertBox('Hi')",
                        "msg('Hi')",
                        "alert('Hi')",
                        "show('Hi')"
                    ],
                    correctAnswer: 2
                },
                {
                    questionText: "Assignment operator is?",
                    options: ["*", "-", "=", "x"],
                    correctAnswer: 2
                }
            ],
            createdBy: user._id,
            createdAt: new Date()
        });

        console.log('✅ Exam created successfully!');
        console.log('📝 Title:', exam.title);
        console.log('❓ Questions:', exam.questions.length);
        console.log('🆔 Exam ID:', exam._id);

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

createTestExam();