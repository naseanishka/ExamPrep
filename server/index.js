import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import examRoutes from './routes/exam.routes.js';
import resultRoutes from './routes/result.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3001';
const allowedOrigins = [CLIENT_ORIGIN];

// Connect to Database
connectDB();

// CORS: only allow the specific origin and support credentials
// app.use(cors({
//     origin: (origin, callback) => {
//         // allow requests with no origin (Postman, mobile, server-to-server)
//         if (!origin) return callback(null, true);
//         if (allowedOrigins.includes(origin)) return callback(null, true);
//         return callback(new Error('CORS origin denied'));
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//     exposedHeaders: ['set-cookie']
// }));


// ...existing code...
// CORS: only allow the specific origin and support credentials
app.use(cors({
    origin: (origin, callback) => {
        // Log for debugging
        console.log('Incoming origin:', origin);

        // Allow requests with no origin (Postman, mobile apps, server-to-server)
        if (!origin) return callback(null, true);

        // Check if origin is in allowed list
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Reject
        console.error('CORS blocked origin:', origin);
        return callback(new Error('CORS origin denied'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['set-cookie']
}));
// ...existing code...



// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/results', resultRoutes);

// Health
app.get('/', (req, res) => {
    res.send('ExamPrep API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err && err.stack ? err.stack : err);
    res.status(500).json({ message: err?.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Accepting requests from: ${allowedOrigins.join(', ')}`);
});