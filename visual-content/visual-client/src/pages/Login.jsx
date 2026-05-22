import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaPinterest, FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Visual background brand colors */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-[#E60023]/10 blur-[80px]"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center">
          <FaPinterest className="h-11 w-11 text-[#E60023]" />
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold tracking-tight text-white">
          Welcome to <span className="text-[#E60023]">PinStack</span>
        </h2>
        <p className="mt-2 text-center text-xs text-zinc-400">
          Find new ideas to try and fuel your visual discoveries
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-zinc-900 border border-zinc-800 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          <form onSubmit={handleLoginSubmit} className="space-y-5">
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
                className="mt-2 block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-700"
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
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-700 pr-12"
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

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center py-3 px-4 rounded-xl text-sm font-extrabold text-white bg-[#E60023] hover:bg-[#b8001c] active:scale-98 transition-all shadow-lg hover:shadow-[#E60023]/20 focus:outline-none"
              >
                {submitting ? (
                  <span className="flex items-center space-x-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    <span>Logging in...</span>
                  </span>
                ) : (
                  "Log in"
                )}
              </button>
            </div>
          </form>

          {/* Nav link to register */}
          <div className="mt-6 text-center border-t border-zinc-800 pt-6">
            <span className="text-xs text-zinc-400">Don't have an account? </span>
            <Link to="/register" className="text-xs font-bold text-[#E60023] hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
