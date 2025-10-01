import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/errorResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';


const generateToken = (id) => {
return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });
};


export const register = asyncHandler(async (req, res, next) => {
const { name, email, password } = req.body;


if (!name || !email || !password) return next(new ErrorResponse('Please provide name, email and password', 400));


const userExists = await User.findOne({ email });
if (userExists) return next(new ErrorResponse('User already exists', 400));


const user = await User.create({ name, email, password });


res.status(201).json({
success: true,
data: {
id: user._id,
name: user.name,
email: user.email,
token: generateToken(user._id),
},
});
});


export const login = asyncHandler(async (req, res, next) => {
const { email, password } = req.body;


if (!email || !password) return next(new ErrorResponse('Please provide email and password', 400));


const user = await User.findOne({ email }).select('+password');
if (!user) return next(new ErrorResponse('Invalid credentials', 401));


const isMatch = await user.matchPassword(password);
if (!isMatch) return next(new ErrorResponse('Invalid credentials', 401));


res.status(200).json({
success: true,
data: {
id: user._id,
name: user.name,
email: user.email,
token: generateToken(user._id),
},
});
});


export const getMe = asyncHandler(async (req, res, next) => {
const user = req.user; // set by protect middleware
res.status(200).json({ success: true, data: user });
});