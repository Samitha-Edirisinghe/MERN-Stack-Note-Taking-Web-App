import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import noteService from '../services/noteService';
import Loader from '../components/Loader';
import Layout from '../components/Layout';
import CollaboratorModal from '../components/CollaboratorModal';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiSave, FiTrash2, FiUsers, FiBold, FiItalic, FiList, FiLink, FiImage } from 'react-icons/fi';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Editor Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 mb-4">Something went wrong with the editor.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Refresh Page
            </button>
          </div>
        </Layout>
      );
    }
    return this.props.children;
  }
}

const NoteEditorContent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNewNote = id === 'new';

  const [title, setTitle] = useState('');
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(!isNewNote);
  const [saving, setSaving] = useState(false);
  const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'text-blue-500 underline' },
      }),
      Image.configure({
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' },
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[350px] p-6',
      },
    },
  });

  useEffect(() => {
    if (!isNewNote && id && editor) {
      const fetchNote = async () => {
        try {
          setLoading(true);
          const data = await noteService.getNoteById(id);
          setNote(data);
          setTitle(data.title || '');
          editor.commands.setContent(data.content || '');
        } catch (error) {
          console.error('Failed to fetch note:', error);
          toast.error(error.response?.data?.message || 'Failed to fetch note');
          navigate('/');
        } finally {
          setLoading(false);
        }
      };
      fetchNote();
    }
  }, [id, isNewNote, editor, navigate]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    const content = editor?.getHTML() || '';

    setSaving(true);
    try {
      if (isNewNote) {
        const savedNote = await noteService.createNote({ title, content });
        toast.success('Note created');
        navigate(`/note/${savedNote._id}`, { replace: true });
      } else {
        const savedNote = await noteService.updateNote(id, { title, content });
        setNote(savedNote);
        toast.success('Note updated');
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error(error.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  }, [title, editor, isNewNote, id, navigate]);

  const handleDelete = useCallback(async () => {
    if (!window.confirm('Are you sure you want to delete this note?')) return;
    try {
      await noteService.deleteNote(id);
      toast.success('Note deleted');
      navigate('/');
    } catch (error) {
      console.error('Failed to delete note:', error);
      toast.error(error.response?.data?.message || 'Failed to delete note');
    }
  }, [id, navigate]);

  const handleCollaboratorUpdate = useCallback((updatedNote) => {
    setNote(updatedNote);
  }, []);

  const isOwner = note && user && note.owner && note.owner._id === user._id;

  if (loading || !editor) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold w-full md:w-auto flex-1 focus:outline-none border-b-2 border-transparent focus:border-blue-500 pb-2 transition-colors"
            disabled={saving}
          />
          <div className="flex space-x-2 self-end md:self-auto">
            {!isNewNote && (
              <>
                <button
                  onClick={() => setShowCollaboratorModal(true)}
                  className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Manage collaborators"
                  disabled={saving}
                >
                  <FiUsers size={20} />
                </button>
                {isOwner && (
                  <button
                    onClick={handleDelete}
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete note"
                    disabled={saving}
                  >
                    <FiTrash2 size={20} />
                  </button>
                )}
              </>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center"
            >
              <FiSave className="mr-2" size={18} />
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* TipTap Toolbar */}
        <div className="border border-gray-200 rounded-t-xl bg-gray-50 p-3 flex flex-wrap gap-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`p-2.5 rounded-lg transition-colors ${
              editor.isActive('bold') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Bold"
          >
            <FiBold size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`p-2.5 rounded-lg transition-colors ${
              editor.isActive('italic') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Italic"
          >
            <FiItalic size={18} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2.5 rounded-lg transition-colors ${
              editor.isActive('bulletList') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Bullet List"
          >
            <FiList size={18} />
          </button>
          <button
            onClick={() => {
              const url = window.prompt('Enter URL:');
              if (url) editor.chain().focus().setLink({ href: url }).run();
            }}
            className={`p-2.5 rounded-lg transition-colors ${
              editor.isActive('link') ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-700'
            }`}
            title="Link"
          >
            <FiLink size={18} />
          </button>
          <button
            onClick={() => {
              const url = window.prompt('Enter image URL:');
              if (url) editor.chain().focus().setImage({ src: url }).run();
            }}
            className="p-2.5 rounded-lg hover:bg-gray-200 text-gray-700 transition-colors"
            title="Image"
          >
            <FiImage size={18} />
          </button>
        </div>

        <EditorContent
          editor={editor}
          className="border border-t-0 border-gray-200 rounded-b-xl p-4 min-h-[400px] bg-white"
        />

        {note && (
          <CollaboratorModal
            isOpen={showCollaboratorModal}
            onClose={() => setShowCollaboratorModal(false)}
            note={note}
            onUpdate={handleCollaboratorUpdate}
          />
        )}
      </div>
    </Layout>
  );
};

// Wrap with ErrorBoundary
const NoteEditor = () => {
  return (
    <ErrorBoundary>
      <NoteEditorContent />
    </ErrorBoundary>
  );
};

export default NoteEditor;