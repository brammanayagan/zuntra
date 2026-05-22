import { Link } from "react-router-dom";
import { FaPinterest, FaCompass } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center px-4 relative overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-[#E60023]/5 blur-[70px]"></div>

      <div className="text-center space-y-6 relative z-10 max-w-md">
        <div className="flex justify-center animate-bounce duration-[2000ms]">
          <FaPinterest className="h-14 w-14 text-[#E60023]" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-7xl font-black text-white tracking-wider">404</h1>
          <h2 className="text-xl font-bold text-zinc-300">Inspiration Lost in Space</h2>
          <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
            The board or Pin you are looking for has been removed, renamed, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-4">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 rounded-full bg-[#E60023] hover:bg-[#b8001c] px-6 py-3 text-sm font-bold text-white transition-all active:scale-95 shadow-lg shadow-[#E60023]/25"
          >
            <FaCompass className="h-4 w-4" />
            <span>Discover Ideas</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
