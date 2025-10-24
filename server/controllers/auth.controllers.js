import bcrypt from "bcrypt";

// 3 steps : Sign-up, Sign-in, Sign-out
// Create 3 controllers for each of these functionalities

import genToken from "../config/token.js";

// Importing user model
import User from "../models/user.model.js";

// 4 fields for Sign-in - email, password, name, userName and they all shd be checked that they dont exist already

export const signUp = async (req, res) => {
    const { name, userName, email, password, role } = req.body;
    console.log(req.body)

    try {
        // check if user already exists
        // Validate User Data

        if (!name || !userName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // Validate role
        if (role && !['student', 'teacher'].includes(role)) {
            return res.status(400).json({ message: "Invalid role. Must be student or teacher" });
        }

        // Validate Email

        const existingUserEmail = await User.findOne({ email });
        // this return a boolean value

        if (existingUserEmail) {
            return res.status(409).json({ message: "Email already exists" });
        }

        // Validate Username

        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(409).json({ message: "Username already exists" });
        }
        if (password.length < 6) {
            return res.status(401).json({ message: "Password should be at least 6 characters" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // const newUser = await User.create({ name, userName, email, password: hashedPassword });
        const newUser = await User.create({
            name,
            userName,
            email,
            password: hashedPassword,
            role: role || 'student'  // ✅ ADD THIS - Default to student if not provided
        });
        const token = await genToken(newUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true, // cookie cannot be accessed by client-side scripts
            // For cross-site requests (Vercel ↔ Render), cookies must be SameSite=None and Secure in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        })

        console.log(newUser)

        // To:
        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                userName: newUser.userName,
                email: newUser.email,
                role: newUser.role  // ✅ ADD THIS LINE
                // Don't include password in response
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}





export const signIn = async (req, res) => {
    const { userName, password } = req.body;

    try {
        if (!userName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ userName });
        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = genToken(existingUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        // Return sanitized user (no password!)
        const userSafe = {
            id: existingUser._id,
            name: existingUser.name,
            userName: existingUser.userName,
            email: existingUser.email,
            role: existingUser.role
        };

        res.status(200).json({ user: userSafe, message: "Sign-in successful" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server error", error: error.message });
    }
};



// Get Current User
export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('❌ Get current user error:', error);
        res.status(500).json({
            message: "Internal Server error",
            error: error.message
        });
    }
};

// Sign out - clear auth cookie
export const signOut = async (_req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            secure: process.env.NODE_ENV === 'production',
            path: '/',
        });
        return res.status(200).json({ message: 'Signed out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to sign out', error: error.message });
    }
};