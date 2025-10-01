import Post from '../models/Post.js';
import asyncHandler from '../middleware/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return next(new ErrorResponse('Please provide title and content', 400));
  }

  const post = await Post.create({
    title,
    content,
    author: req.user._id, // set by protect middleware
  });

  res.status(201).json({ success: true, data: post });
});

// @desc    Get all posts with pagination
// @route   GET /api/posts
// @access  Public
export const getPosts = asyncHandler(async (req, res, next) => {
  let { page = 1, limit = 10 } = req.query;
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const total = await Post.countDocuments();
  const pages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .populate('author', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const pagination = {};
  if (skip + limit < total) pagination.next = { page: page + 1, limit };
  if (skip > 0) pagination.prev = { page: page - 1, limit };

  res.status(200).json({
    success: true,
    count: posts.length,
    total,
    page,
    pages,
    pagination,
    data: posts,
  });
});

// @desc Get single post
// @route GET /api/posts/:id
// @access Public
export const getPost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate('author', 'name email');
  if (!post) return next(new ErrorResponse('Post not found', 404));
  res.status(200).json({ success: true, data: post });
});

// @desc Update a post
// @route PUT /api/posts/:id
// @access Private (author only)
export const updatePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorResponse('Post not found', 404));

  if (post.author.toString() !== req.user._id.toString())
    return next(new ErrorResponse('Not authorized to update this post', 401));

  const { title, content } = req.body;
  if (title !== undefined) post.title = title;
  if (content !== undefined) post.content = content;

  await post.save();
  res.status(200).json({ success: true, data: post });
});

// @desc Delete a post
// @route DELETE /api/posts/:id
// @access Private (author only)
export const deletePost = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new ErrorResponse('Post not found', 404));

  if (post.author.toString() !== req.user._id.toString())
    return next(new ErrorResponse('Not authorized to delete this post', 401));

  await post.remove();
  res.status(200).json({ success: true, data: {} });
});
