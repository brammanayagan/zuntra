import { useState, useEffect, useRef } from "react";
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

  // Infinite Scroll Pagination states
  const [visibleCount, setVisibleCount] = useState(12);
  const [isScrollingLoader, setIsScrollingLoader] = useState(false);
  const loadMoreRef = useRef(null);

  // Reset pagination count on search/category change
  useEffect(() => {
    setVisibleCount(12);
  }, [activeCategory, searchQuery]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (pins.length <= visibleCount) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !isScrollingLoader) {
          setIsScrollingLoader(true);
          // Smooth simulated loading delay for visual feedback
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 8, pins.length));
            setIsScrollingLoader(false);
          }, 600);
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [pins.length, visibleCount, isScrollingLoader]);

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
                {pins.slice(0, visibleCount).map((pin) => (
                  <PinCard key={pin._id} pin={pin} />
                ))}
              </MasonryGrid>

              {/* Infinite Scroll Anchor & Loader */}
              {pins.length > visibleCount && (
                <div ref={loadMoreRef} className="py-8 flex justify-center w-full">
                  {isScrollingLoader ? (
                    <div className="flex space-x-1.5 items-center">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#E60023] [animation-delay:-0.3s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#E60023] [animation-delay:-0.15s]"></span>
                      <span className="h-2 w-2 animate-bounce rounded-full bg-[#E60023]"></span>
                      <span className="text-xs font-semibold text-zinc-500 tracking-wider ml-2">Loading more inspiration...</span>
                    </div>
                  ) : (
                    <div className="h-4"></div>
                  )}
                </div>
              )}
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
