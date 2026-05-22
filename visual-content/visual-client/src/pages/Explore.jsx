import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setActiveCategory, setSearchQuery } from "../app/feedSlice";
import Navbar from "../components/common/Navbar";
import { FaCompass } from "react-icons/fa";

const topics = [
  {
    title: "Coding & Tech",
    tag: "tech",
    bgGradient: "from-blue-600 to-indigo-900",
    desc: "Innovative programs, developer workspaces, and future concepts.",
  },
  {
    title: "Minimal Design",
    tag: "design",
    bgGradient: "from-rose-600 to-purple-900",
    desc: "Stunning graphics layout, product concepts, and UI styling.",
  },
  {
    title: "Visual Art",
    tag: "art",
    bgGradient: "from-amber-500 to-orange-800",
    desc: "Creative sketches, canvas wonders, and hand-crafted pieces.",
  },
  {
    title: "Wild Nature",
    tag: "nature",
    bgGradient: "from-emerald-600 to-teal-900",
    desc: "Scenic environments, wildlife frames, and raw green landscapes.",
  },
  {
    title: "Gourmet Culinary",
    tag: "food",
    bgGradient: "from-orange-500 to-red-800",
    desc: "Delicious recipes, cooking aesthetics, and plating highlights.",
  },
  {
    title: "Wanderlust Travel",
    tag: "travel",
    bgGradient: "from-sky-500 to-cyan-800",
    desc: "Exotic locations, architectural captures, and backpacker routes.",
  },
];

const Explore = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleTopicClick = (tag) => {
    dispatch(setActiveCategory(tag));
    dispatch(setSearchQuery(""));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center space-x-3 mb-8">
          <FaCompass className="h-7 w-7 text-[#E60023]" />
          <h1 className="text-3xl font-extrabold tracking-tight">Explore Inspiration</h1>
        </div>

        {/* Visual Grids of Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <div
              key={topic.title}
              onClick={() => handleTopicClick(topic.tag)}
              className={`relative cursor-pointer overflow-hidden rounded-3xl bg-gradient-to-br ${topic.bgGradient} p-6 h-56 flex flex-col justify-end transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-black/40 group`}
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
              
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-bold tracking-widest uppercase bg-black/45 backdrop-blur-md px-3 py-1 rounded-full text-white inline-block">
                  #{topic.tag}
                </span>
                <h3 className="text-xl font-bold text-white leading-tight">{topic.title}</h3>
                <p className="text-xs text-zinc-200 line-clamp-2 leading-relaxed">
                  {topic.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Explore;
