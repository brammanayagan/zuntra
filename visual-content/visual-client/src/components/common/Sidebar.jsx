import { useDispatch, useSelector } from "react-redux";
import { setActiveCategory, setSearchQuery } from "../../app/feedSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaCompass,
  FaImages,
  FaLaptopCode,
  FaPaintBrush,
  FaTree,
  FaUtensils,
  FaPlaneDeparture,
} from "react-icons/fa";

const categories = [
  { name: "All", value: "", icon: FaCompass },
  { name: "Tech", value: "tech", icon: FaLaptopCode },
  { name: "Art & Craft", value: "art", icon: FaPaintBrush },
  { name: "Design", value: "design", icon: FaImages },
  { name: "Nature", value: "nature", icon: FaTree },
  { name: "Food", value: "food", icon: FaUtensils },
  { name: "Travel", value: "travel", icon: FaPlaneDeparture },
];

const Sidebar = () => {
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => state.feed.activeCategory);
  const navigate = useNavigate();
  const location = useLocation();

  const handleCategorySelect = (value) => {
    dispatch(setActiveCategory(value));
    dispatch(setSearchQuery("")); // Clear search to focus on category

    // Redirect to home if on another page
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  return (
    <aside className="w-full shrink-0 border-b border-zinc-800 bg-zinc-950 p-4 md:h-[calc(100vh-4rem)] md:w-64 md:border-r md:border-b-0">
      <div className="flex flex-col space-y-6">
        <div>
          <h2 className="px-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
            Categories
          </h2>
          <div className="mt-3 flex flex-row overflow-x-auto gap-2 md:flex-col md:overflow-x-visible md:space-y-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.value;

              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`flex items-center space-x-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all shrink-0 md:shrink ${
                    isSelected
                      ? "bg-[#E60023] text-white"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? "text-white" : "text-zinc-500"}`} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="hidden border-t border-zinc-800 pt-6 md:block">
          <p className="px-2 text-xs text-zinc-500">
            © 2026 PixelCanvas Inc.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
