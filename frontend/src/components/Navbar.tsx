import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white text-gray-800 shadow-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-xl font-bold tracking-tight text-teal-600">QuickCut</Link>
          </div>
          <div className="flex space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="px-3 py-2 rounded-md text-gray-700 hover:text-teal-600 transition-colors">
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-3 py-2 text-gray-700 hover:text-teal-600 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-3 py-2 bg-teal-600 text-white font-medium rounded-md hover:bg-teal-700 transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;