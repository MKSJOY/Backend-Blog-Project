import express from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/postController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts (paginated)
// @access  Public
// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.route('/')
  .get(getPosts)
  .post(protect, createPost);

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
// @access  Public
// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private (author only)
// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private (author only)
router.route('/:id')
  .get(getPost)
  .put(protect, updatePost)
  .delete(protect, deletePost);

export default router;
