import api from './api';

const getNotes = async () => {
  const response = await api.get('/notes');
  return response.data;
};

const getNoteById = async (id) => {
  const response = await api.get(`/notes/${id}`);
  return response.data;
};

const createNote = async (noteData) => {
  const response = await api.post('/notes', noteData);
  return response.data;
};

const updateNote = async (id, noteData) => {
  const response = await api.put(`/notes/${id}`, noteData);
  return response.data;
};

const deleteNote = async (id) => {
  const response = await api.delete(`/notes/${id}`);
  return response.data;
};

const searchNotes = async (query) => {
  const response = await api.get(`/notes/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

const addCollaborator = async (noteId, email) => {
  const response = await api.post(`/notes/${noteId}/collaborators`, { email });
  return response.data;
};

const removeCollaborator = async (noteId, userId) => {
  const response = await api.delete(`/notes/${noteId}/collaborators/${userId}`);
  return response.data;
};

export default {
  getNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  addCollaborator,
  removeCollaborator,
};