import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPins, setFeedLoading } from "../app/feedSlice";
import axiosInstance from "../api/axios";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import Loader from "../components/common/Loader";
import MasonryGrid from "../components/common/MasonryGrid";
import PinCard from "../components/pin/PinCard";
import PinModal from "../components/pin/PinModal";
import { FaRegFrownOpen } from "react-icons/fa";

const Home = () => {
  const dispatch = useDispatch();
  const pins = useSelector((state) => state.feed.pins);
  const feedLoading = useSelector((state) => state.feed.feedLoading);
  const searchQuery = useSelector((state) => state.feed.searchQuery);
  const activeCategory = useSelector((state) => state.feed.activeCategory);

  // Load Pins feed on query updates
  useEffect(() => {
    const fetchPins = async () => {
      dispatch(setFeedLoading(true));
      try {
        const params = {};
        if (activeCategory) params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;

        const response = await axiosInstance.get("/pins", { params });
        if (response.data.success) {
          dispatch(setPins(response.data.pins));
        }
      } catch (error) {
        console.error("Failed to load pins feed:", error);
      } finally {
        dispatch(setFeedLoading(false));
      }
    };

    fetchPins();
  }, [activeCategory, searchQuery, dispatch]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      {/* Main Split Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar />

        {/* Content Pane */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          {feedLoading ? (
            <div className="flex h-[50vh] items-center justify-center">
              <Loader />
            </div>
          ) : pins.length === 0 ? (
            <div className="flex flex-col h-[50vh] items-center justify-center text-center space-y-4">
              <FaRegFrownOpen className="h-12 w-12 text-zinc-600" />
              <div>
                <h3 className="text-lg font-bold text-zinc-300">No Pins Found</h3>
                <p className="text-zinc-500 text-sm mt-1">
                  We couldn't find anything matching your filters. Try clearing your search!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filter Indicators */}
              {(activeCategory || searchQuery) && (
                <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400">
                  <span>Filtered feed by:</span>
                  {activeCategory && (
                    <span className="rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-white">
                      Category: {activeCategory}
                    </span>
                  )}
                  {searchQuery && (
                    <span className="rounded-full bg-[#E60023]/10 border border-[#E60023]/30 px-3 py-1 text-[#E60023]">
                      Search: "{searchQuery}"
                    </span>
                  )}
                </div>
              )}

              {/* Masonry Layout Grid */}
              <MasonryGrid>
                {pins.map((pin) => (
                  <PinCard key={pin._id} pin={pin} />
                ))}
              </MasonryGrid>
            </div>
          )}
        </main>
      </div>

      {/* Global Immersive Modal Overlay */}
      <PinModal />
    </div>
  );
};

export default Home;
