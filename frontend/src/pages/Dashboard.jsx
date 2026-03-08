import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import noteService from '../services/noteService';
import NoteCard from '../components/NoteCard';
import Loader from '../components/Loader';
import Layout from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiFileText } from 'react-icons/fi';

const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const searchQuery = searchParams.get('search') || '';

  const fetchNotes = async () => {
    try {
      setLoading(true);
      let data;
      if (searchQuery) {
        data = await noteService.searchNotes(searchQuery);
      } else {
        data = await noteService.getNotes();
      }
      setNotes(data);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [searchQuery]);

  const handleDelete = async (noteId) => {
    try {
      await noteService.deleteNote(noteId);
      setNotes(notes.filter(note => note._id !== noteId));
      toast.success('Note deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {searchQuery ? (
              <>Search results for "<span className="text-blue-600">{searchQuery}</span>"</>
            ) : (
              'Your Notes'
            )}
          </h2>
          <p className="text-gray-500 mt-2">
            {searchQuery
              ? `Found ${notes.length} note${notes.length !== 1 ? 's' : ''}`
              : 'Manage and collaborate on your notes'}
          </p>
        </div>
        {loading ? (
          <Loader />
        ) : notes.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <FiFileText className="mx-auto text-gray-300 text-6xl mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No notes found matching your search.' : 'No notes yet. Create your first note!'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                currentUser={user}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;