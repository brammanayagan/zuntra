import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Upload from "../pages/Upload";
import PinDetails from "../pages/PinDetails";
import NotFound from "../pages/NotFound";
import Loader from "../components/common/Loader";

// Wrapper for routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white">
        <Loader />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Wrapper for login/register pages that authenticated users shouldn't access
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-zinc-950 text-white">
        <Loader />
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/pin/:id" element={<PinDetails />} />
      <Route path="/profile/:id" element={<Profile />} />

      {/* Auth Pages (Unauthenticated Only) */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Pages (Authenticated Only) */}
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <Upload />
          </ProtectedRoute>
        }
      />

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
