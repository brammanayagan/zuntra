import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../app/feedSlice";
import { useAuth } from "../../context/AuthContext";
import { FaPinterest, FaSearch, FaPlus, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.feed.searchQuery);
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch));
    
    // Redirect to home if searching from other pages
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setSearchQuery(""));
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2 text-white">
            <FaPinterest className="h-8 w-8 text-[#E60023] hover:scale-105 transition-transform" />
            <span className="hidden font-extrabold text-xl tracking-tight sm:block">
              Pin<span className="text-[#E60023]">Stack</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden items-center space-x-1 md:flex">
            <Link
              to="/"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                location.pathname === "/"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                location.pathname === "/explore"
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              }`}
            >
              Explore
            </Link>
          </nav>
        </div>

        {/* Dynamic Search Bar */}
        <div className="mx-4 flex flex-1 max-w-lg md:max-w-xl">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <FaSearch className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              placeholder="Search by title, category, or tags..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full rounded-full border border-zinc-800 bg-zinc-900 py-2 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none ring-offset-zinc-950 transition-colors focus:border-zinc-700 focus:ring-1 focus:ring-zinc-700"
            />
            {localSearch && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-zinc-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              {/* Quick upload trigger */}
              <Link
                to="/upload"
                className="flex items-center space-x-1 rounded-full bg-[#E60023] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#b8001c] active:scale-95"
                title="Create a Pin"
              >
                <FaPlus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Create</span>
              </Link>

              {/* Profile Shortcut */}
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center space-x-2 rounded-full border border-zinc-800 bg-zinc-900 p-1 pr-3 hover:bg-zinc-800 transition-colors"
                title="View Profile"
              >
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="h-7 w-7 rounded-full object-cover border border-zinc-800"
                  onError={(e) => {
                    e.target.src = "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg";
                  }}
                />
                <span className="hidden text-xs font-bold text-white max-w-[80px] truncate sm:block">
                  {user.username}
                </span>
              </Link>

              {/* Logout */}
              <button
                onClick={logout}
                className="rounded-full border border-zinc-800 p-2 text-zinc-400 hover:bg-zinc-900 hover:text-[#E60023] transition-colors"
                title="Logout"
              >
                <FaSignOutAlt className="h-4 w-4" />
              </button>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="rounded-full bg-zinc-900 border border-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-zinc-800"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-[#E60023] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#b8001c]"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
