import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPinterest, FaEye, FaEyeSlash } from "react-icons/fa";
import toast from "react-hot-toast";

const Register = () => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (username.length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    setSubmitting(true);
    const result = await register(username, email, password);
    setSubmitting(false);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Dynamic blurred background accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#E60023]/10 blur-[80px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <FaPinterest className="h-11 w-11 text-[#E60023]" />
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-white">
          Create <span className="text-[#E60023]">PinStack</span> Account
        </h2>
        <p className="mt-2 text-center text-xs text-zinc-400">
          Join us to start curating and sharing your inspirations
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-zinc-900 border border-zinc-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="developer_101"
                className="mt-2 block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-700"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="mt-2 block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-700"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••• (min 6 chars)"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-700 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
                >
                  {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-bold text-zinc-400 uppercase tracking-wide">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-700"
              />
            </div>

            {/* Submit */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-extrabold text-white bg-[#E60023] hover:bg-[#b8001c] active:scale-98 transition-all shadow-lg hover:shadow-[#E60023]/20 focus:outline-none"
              >
                {submitting ? (
                  <span className="flex items-center space-x-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span>Signing up...</span>
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>
          </form>

          {/* Transition link */}
          <div className="mt-6 text-center border-t border-zinc-800 pt-6">
            <span className="text-xs text-zinc-400">Already registered? </span>
            <Link to="/login" className="text-xs font-bold text-[#E60023] hover:underline">
              Log in instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
