import { Link, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const NoteCard = ({ note, currentUser, onDelete }) => {
  const navigate = useNavigate();
  const isOwner = currentUser && note.owner && note.owner._id === currentUser._id;

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/note/${note._id}`);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(note._id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 mb-4 relative group border border-gray-100">
      <Link to={`/note/${note._id}`} className="block">
        <h3 className="text-2xl font-bold text-gray-800 mb-3 pr-20 hover:text-blue-600 transition-colors">
          {note.title}
        </h3>
        <div
          className="text-gray-600 mb-4 line-clamp-3 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: note.content }}
        />
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="bg-gray-100 px-3 py-1 rounded-full">Owner: {note.owner?.name}</span>
          <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
        </div>
        {note.collaborators?.length > 1 && (
          <div className="mt-3 text-xs text-gray-400 bg-gray-50 inline-block px-3 py-1 rounded-full">
            {note.collaborators.length - 1} collaborator(s)
          </div>
        )}
      </Link>

      {/* Action buttons */}
      <div className="absolute top-5 right-5 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleEdit}
          className="p-2.5 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
          title="Edit"
        >
          <FiEdit2 size={18} />
        </button>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="p-2.5 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default NoteCard;