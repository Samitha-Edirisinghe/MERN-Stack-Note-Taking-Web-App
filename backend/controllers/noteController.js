const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const User = require('../models/User');

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.create({
    title,
    content,
    owner: req.user._id,
    collaborators: [req.user._id],
  });
  res.status(201).json(note);
});

// @desc    Get all notes for logged-in user (including collaborations)
// @route   GET /api/notes
// @access  Private
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({
    collaborators: { $in: [req.user._id] },
  })
    .populate('owner', 'name email')
    .populate('collaborators', 'name email')
    .sort('-updatedAt');
  res.json(notes);
});

// @desc    Get a single note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id)
    .populate('owner', 'name email')
    .populate('collaborators', 'name email');

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if user is a collaborator
  if (!note.collaborators.some(c => c._id.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to view this note');
  }

  res.json(note);
});

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Check if user is a collaborator
  if (!note.collaborators.some(c => c.toString() === req.user._id.toString())) {
    res.status(403);
    throw new Error('Not authorized to edit this note');
  }

  note.title = title || note.title;
  note.content = content || note.content;
  const updatedNote = await note.save();
  res.json(updatedNote);
});

// @desc    Delete a note (only owner)
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Only owner can delete
  if (note.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the owner can delete this note');
  }

  await note.deleteOne();
  res.json({ message: 'Note removed' });
});

// @desc    Add collaborator to note
// @route   POST /api/notes/:id/collaborators
// @access  Private
const addCollaborator = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Only owner can add collaborators
  if (note.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the owner can add collaborators');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (note.collaborators.includes(user._id)) {
    res.status(400);
    throw new Error('User is already a collaborator');
  }

  note.collaborators.push(user._id);
  await note.save();

  const populatedNote = await note.populate('collaborators', 'name email');
  res.json(populatedNote);
});

// @desc    Remove collaborator from note
// @route   DELETE /api/notes/:id/collaborators/:userId
// @access  Private
const removeCollaborator = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }

  // Only owner can remove collaborators
  if (note.owner.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Only the owner can remove collaborators');
  }

  const collaboratorId = req.params.userId;
  if (!note.collaborators.includes(collaboratorId)) {
    res.status(404);
    throw new Error('Collaborator not found');
  }

  if (note.owner.toString() === collaboratorId) {
    res.status(400);
    throw new Error('Cannot remove the owner');
  }

  note.collaborators = note.collaborators.filter(
    (c) => c.toString() !== collaboratorId
  );
  await note.save();

  const populatedNote = await note.populate('collaborators', 'name email');
  res.json(populatedNote);
});

// @desc    Search notes by title/content
// @route   GET /api/notes/search?q=query
// @access  Private
const searchNotes = asyncHandler(async (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.json([]);
    return;
  }

  const notes = await Note.find({
    $and: [
      { collaborators: { $in: [req.user._id] } },
      {
        $or: [
          { title: { $regex: q, $options: 'i' } },
          { content: { $regex: q, $options: 'i' } },
        ],
      },
    ],
  })
    .populate('owner', 'name email')
    .populate('collaborators', 'name email')
    .sort('-updatedAt');

  res.json(notes);
});

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  addCollaborator,
  removeCollaborator,
  searchNotes,
};