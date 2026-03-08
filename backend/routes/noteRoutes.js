const express = require('express');
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  addCollaborator,
  removeCollaborator,
  searchNotes,
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/')
  .post(protect, createNote)
  .get(protect, getNotes);

router.get('/search', protect, searchNotes);

router.route('/:id')
  .get(protect, getNoteById)
  .put(protect, updateNote)
  .delete(protect, deleteNote);

router.route('/:id/collaborators')
  .post(protect, addCollaborator);

router.route('/:id/collaborators/:userId')
  .delete(protect, removeCollaborator);

module.exports = router;