import { useState } from 'react';
import { FiX, FiUserPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import noteService from '../services/noteService';
import { useAuth } from '../hooks/useAuth';

const CollaboratorModal = ({ isOpen, onClose, note, onUpdate }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const updatedNote = await noteService.addCollaborator(note._id, email);
      onUpdate(updatedNote);
      setEmail('');
      toast.success('Collaborator added');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (userId) => {
    if (!window.confirm('Remove this collaborator?')) return;

    setLoading(true);
    try {
      const updatedNote = await noteService.removeCollaborator(note._id, userId);
      onUpdate(updatedNote);
      toast.success('Collaborator removed');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove collaborator');
    } finally {
      setLoading(false);
    }
  };

  const isOwner = user && note.owner && note.owner._id === user._id;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Manage Collaborators</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {isOwner && (
          <form onSubmit={handleAddCollaborator} className="mb-6 flex">
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-r-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              disabled={loading}
            >
              <FiUserPlus size={20} />
            </button>
          </form>
        )}

        <div>
          <h3 className="font-semibold text-gray-700 mb-3">Current Collaborators</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {note.collaborators?.map((collaborator) => (
              <li
                key={collaborator._id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-800 truncate">{collaborator.name}</p>
                  <p className="text-sm text-gray-500 truncate">{collaborator.email}</p>
                  {collaborator._id === note.owner._id && (
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Owner
                    </span>
                  )}
                </div>
                {isOwner && collaborator._id !== note.owner._id && (
                  <button
                    onClick={() => handleRemoveCollaborator(collaborator._id)}
                    className="text-red-500 hover:text-red-700 p-2 transition-colors"
                    disabled={loading}
                  >
                    <FiTrash2 size={18} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CollaboratorModal;