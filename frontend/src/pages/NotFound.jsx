import { Link } from 'react-router-dom';
import { FiAlertCircle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <FiAlertCircle className="text-gray-300 text-8xl mb-4" />
      <h1 className="text-7xl font-bold text-gray-800 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-8">Page not found</p>
      <Link
        to="/"
        className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
      >
        Go back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;