import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../app/store";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import SaveButton from "./SaveButton";
import CommentSection from "./CommentSection";
import { FaTimes, FaHeart, FaRegHeart, FaArrowCircleDown, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const PinModal = () => {
  const { selectedPin, closePinModal, removePin, setSearchQuery } = useStore();
  const { user, isAuthenticated } = useAuth();
  const [pinDetails, setPinDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const navigate = useNavigate();

  const isLiked = user ? likes.includes(user._id) : false;
  const isCreator = user && pinDetails ? pinDetails.postedBy?._id === user._id || pinDetails.postedBy === user._id : false;

  const resolveImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  // Fetch complete details on pin modal load
  useEffect(() => {
    if (!selectedPin) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/pins/${selectedPin._id}`);
        if (response.data.success) {
          const pin = response.data.pin;
          setPinDetails(pin);
          setLikes(pin.likes || []);
          setFollowersCount(pin.postedBy?.followers?.length || 0);
          
          if (user && pin.postedBy) {
            setIsFollowing(pin.postedBy.followers?.includes(user._id));
          }
        }
      } catch (error) {
        toast.error("Failed to load Pin details");
        closePinModal();
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [selectedPin, user, closePinModal]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like pins!");
      return;
    }

    try {
      const response = await axiosInstance.put(`/pins/like/${pinDetails._id}`);
      if (response.data.success) {
        if (response.data.isLiked) {
          setLikes([...likes, user._id]);
        } else {
          setLikes(likes.filter((id) => id !== user._id));
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to follow creators!");
      return;
    }

    const authorId = pinDetails.postedBy?._id || pinDetails.postedBy;
    try {
      const response = await axiosInstance.put(`/users/follow/${authorId}`);
      if (response.data.success) {
        setIsFollowing(response.data.isFollowing);
        setFollowersCount(response.data.followersCount);
        toast.success(response.data.isFollowing ? "Following creator" : "Unfollowed creator");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update follow relation");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this Pin?")) return;

    try {
      const response = await axiosInstance.delete(`/pins/${pinDetails._id}`);
      if (response.data.success) {
        toast.success("Pin deleted!");
        removePin(pinDetails._id);
        closePinModal();
      }
    } catch (error) {
      toast.error("Failed to delete Pin");
    }
  };

  const handleTagClick = (tag) => {
    setSearchQuery(tag);
    closePinModal();
    navigate("/");
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(resolveImageUrl(pinDetails.image));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pinDetails.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  if (!selectedPin) return null;

  return (
    <div
      onClick={closePinModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 backdrop-blur-sm p-4 overflow-y-auto"
    >
      {/* Modal Box */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex flex-col md:flex-row w-full max-w-5xl bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in my-auto max-h-[90vh] md:max-h-[85vh]"
      >
        {/* Left Side: Visual Image */}
        <div className="md:w-1/2 bg-zinc-950 flex items-center justify-center p-2 relative max-h-[40vh] md:max-h-none overflow-hidden">
          <img
            src={resolveImageUrl(selectedPin.image)}
            alt={selectedPin.title}
            className="w-full h-full max-h-[40vh] md:max-h-[80vh] object-contain"
            onError={(e) => {
              e.target.src = "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg";
            }}
          />
        </div>

        {/* Right Side: Detailed Column */}
        <div className="md:w-1/2 flex flex-col p-6 sm:p-8 h-full overflow-y-auto max-h-[50vh] md:max-h-[85vh]">
          {/* Top Command Bar */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
            <div className="flex items-center space-x-3">
              <SaveButton pinId={selectedPin._id} initialSaves={selectedPin.saves} />
              
              <button
                onClick={handleDownload}
                className="rounded-full bg-zinc-800 hover:bg-zinc-700 p-2.5 text-zinc-300 transition-colors"
                title="Download Image"
              >
                <FaArrowCircleDown className="h-4 w-4" />
              </button>

              {isCreator && (
                <button
                  onClick={handleDelete}
                  className="rounded-full bg-red-950/80 hover:bg-red-900 p-2.5 text-red-500 transition-colors"
                  title="Delete Pin"
                >
                  <FaTrash className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={closePinModal}
              className="rounded-full bg-zinc-800 hover:bg-zinc-700 p-2 text-zinc-300 transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          {loading ? (
            <div className="flex flex-1 items-center justify-center py-12">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-[#E60023] border-t-transparent"></span>
            </div>
          ) : (
            <div className="flex flex-col flex-1 space-y-5">
              {/* Category, Title & Description */}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#E60023]">
                  {pinDetails.category}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 leading-tight">
                  {pinDetails.title}
                </h1>
                <p className="text-sm text-zinc-300 mt-3 whitespace-pre-line leading-relaxed">
                  {pinDetails.description || "No description provided."}
                </p>
              </div>

              {/* Tag Cloud */}
              {pinDetails.tags && pinDetails.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {pinDetails.tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagClick(tag)}
                      className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-all active:scale-95"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              )}

              {/* Likes Stats */}
              <div className="flex items-center space-x-3 bg-zinc-900/60 border border-zinc-800/50 p-3 rounded-2xl">
                <button
                  onClick={handleLike}
                  className={`rounded-full p-2.5 transition-colors cursor-pointer ${
                    isLiked ? "bg-red-500/20 text-red-500" : "bg-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <FaHeart className="h-4.5 w-4.5" />
                </button>
                <div>
                  <div className="text-xs text-zinc-400 font-semibold">Likes</div>
                  <div className="text-sm font-bold text-white">{likes.length} people liked this</div>
                </div>
              </div>

              {/* Creator Profile Information */}
              <div className="flex items-center justify-between border-t border-b border-zinc-800 py-4">
                <div
                  onClick={() => {
                    closePinModal();
                    navigate(`/profile/${pinDetails.postedBy?._id || pinDetails.postedBy}`);
                  }}
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-85 transition-opacity"
                >
                  <img
                    src={pinDetails.postedBy?.avatar || "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg"}
                    alt={pinDetails.postedBy?.username}
                    className="h-10 w-10 rounded-full object-cover border border-zinc-800"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-white">
                      {pinDetails.postedBy?.username || "pinstacker"}
                    </span>
                    <span className="text-xs text-zinc-500">
                      {followersCount} followers
                    </span>
                  </div>
                </div>

                {user?._id !== (pinDetails.postedBy?._id || pinDetails.postedBy) && (
                  <button
                    onClick={handleFollowToggle}
                    className={`rounded-full px-4 py-2 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      isFollowing
                        ? "bg-zinc-800 border border-zinc-700 text-white"
                        : "bg-[#E60023] text-white hover:bg-[#b8001c]"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>
                )}
              </div>

              {/* Populate Comment Section */}
              <div className="flex-1">
                <CommentSection
                  pinId={pinDetails._id}
                  initialComments={pinDetails.comments || []}
                  onCommentAdded={(comments) => {
                    setPinDetails({ ...pinDetails, comments });
                  }}
                  onCommentDeleted={(comments) => {
                    setPinDetails({ ...pinDetails, comments });
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PinModal;
