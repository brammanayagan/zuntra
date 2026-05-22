import MasonryGrid from "../common/MasonryGrid";
import PinCard from "../pin/PinCard";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const UserPins = ({ pins = [], isOwnProfile }) => {
  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <p className="text-zinc-500 text-sm">No Pins created yet.</p>
        {isOwnProfile && (
          <Link
            to="/upload"
            className="flex items-center space-x-1.5 rounded-full bg-[#E60023] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#b8001c] transition-all"
          >
            <FaPlus className="h-3 w-3" />
            <span>Create Your First Pin</span>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <MasonryGrid>
        {pins.map((pin) => (
          <PinCard key={pin._id} pin={pin} />
        ))}
      </MasonryGrid>
    </div>
  );
};

export default UserPins;
