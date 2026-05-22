import MasonryGrid from "../common/MasonryGrid";
import PinCard from "../pin/PinCard";
import { Link } from "react-router-dom";
import { FaCompass } from "react-icons/fa";

const SavedPins = ({ pins = [], isOwnProfile }) => {
  if (pins.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <p className="text-zinc-500 text-sm">No saved Pins on this board yet.</p>
        {isOwnProfile && (
          <Link
            to="/"
            className="flex items-center space-x-1.5 rounded-full bg-zinc-800 border border-zinc-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-zinc-700 transition-all"
          >
            <FaCompass className="h-3.5 w-3.5 text-[#E60023]" />
            <span>Explore Pins to Save</span>
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

export default SavedPins;
