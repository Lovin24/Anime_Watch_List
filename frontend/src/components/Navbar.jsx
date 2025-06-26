import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            {/* Text-based logo */}
            <span className="text-yellow-400 text-2xl font-extrabold tracking-wide font-poppins hover:text-yellow-300 transition">
              AnimeWatchList
            </span>
          </Link>

          <Link
            to="/"
            className={`ml-6 text-lg ${
              isActive("/") ? "text-white" : "text-purple-300"
            } hover:text-white transition`}
          >
            Watchlist
          </Link>

          <Link
            to="/search"
            className={`text-lg ${
              isActive("/search") ? "text-white" : "text-purple-300"
            } hover:text-white transition`}
          >
            Search
          </Link>

          <Link
            to="/recommendations"
            className={`text-lg ${
              isActive("/recommendations") ? "text-white" : "text-purple-300"
            } hover:text-white transition flex items-center gap-1`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            AI Recommendations
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-300 hidden sm:inline">
                Hi, <span className="font-medium">{user.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-md text-white text-sm transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-purple-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-purple-300 hover:text-white transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
