import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import SaveButton from "../components/pin/SaveButton";
import CommentSection from "../components/pin/CommentSection";
import { FaHeart, FaArrowLeft, FaArrowCircleDown, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const PinDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [pin, setPin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const navigate = useNavigate();

  const isLiked = user ? likes.includes(user._id) : false;
  const isCreator = user && pin ? pin.postedBy?._id === user._id || pin.postedBy === user._id : false;

  const resolveImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000${img}`;
  };

  useEffect(() => {
    const fetchPinDetails = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/pins/${id}`);
        if (response.data.success) {
          const fetchedPin = response.data.pin;
          setPin(fetchedPin);
          setLikes(fetchedPin.likes || []);
          setFollowersCount(fetchedPin.postedBy?.followers?.length || 0);

          if (user && fetchedPin.postedBy) {
            setIsFollowing(fetchedPin.postedBy.followers?.includes(user._id));
          }
        }
      } catch (error) {
        toast.error("Failed to load Pin details");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchPinDetails();
  }, [id, user, navigate]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to like pins!");
      return;
    }

    try {
      const response = await axiosInstance.put(`/pins/like/${pin._id}`);
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

    const authorId = pin.postedBy?._id || pin.postedBy;
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
      const response = await axiosInstance.delete(`/pins/${pin._id}`);
      if (response.data.success) {
        toast.success("Pin deleted!");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to delete Pin");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(resolveImageUrl(pin.image));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${pin.title.replace(/\s+/g, "_")}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      toast.error("Failed to download image");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6 sm:py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white mb-6 text-sm font-semibold transition-colors"
        >
          <FaArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>

        {loading ? (
          <div className="flex h-[50vh] items-center justify-center">
            <Loader />
          </div>
        ) : !pin ? (
          <div className="text-center py-20 text-zinc-500 text-sm">Pin details not found.</div>
        ) : (
          <div className="flex flex-col md:flex-row w-full bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in">
            {/* Left Side: Visual Image */}
            <div className="md:w-1/2 bg-zinc-950 flex items-center justify-center p-4">
              <img
                src={resolveImageUrl(pin.image)}
                alt={pin.title}
                className="w-full h-auto max-h-[70vh] object-contain rounded-2xl"
                onError={(e) => {
                  e.target.src = "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg";
                }}
              />
            </div>

            {/* Right Side: Detailed Column */}
            <div className="md:w-1/2 flex flex-col p-6 sm:p-10 border-t md:border-t-0 md:border-l border-zinc-800 justify-between">
              <div className="space-y-6">
                {/* Actions Top bar */}
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <SaveButton pinId={pin._id} initialSaves={pin.saves} />
                    
                    <button
                      onClick={handleDownload}
                      className="rounded-full bg-zinc-800 hover:bg-zinc-700 p-2.5 text-zinc-300 transition-colors"
                      title="Download Image"
                    >
                      <FaArrowCircleDown className="h-4 w-4" />
                    </button>
                  </div>

                  {isCreator && (
                    <button
                      onClick={handleDelete}
                      className="rounded-full bg-red-950 hover:bg-red-900 p-2.5 text-red-500 transition-colors"
                      title="Delete Pin"
                    >
                      <FaTrash className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Info Text */}
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#E60023]">
                    {pin.category}
                  </span>
                  <h1 className="text-3xl font-extrabold text-white mt-1 leading-tight">{pin.title}</h1>
                  <p className="text-sm text-zinc-300 mt-4 whitespace-pre-line leading-relaxed">
                    {pin.description || "No description provided."}
                  </p>
                </div>

                {/* Tag Cloud */}
                {pin.tags && pin.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {pin.tags.map((tag) => (
                      <Link
                        key={tag}
                        to="/"
                        className="rounded-full bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 px-3 py-1 text-xs text-zinc-300 transition-colors"
                      >
                        #{tag}
                      </Link>
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

                {/* Author Info */}
                <div className="flex items-center justify-between border-t border-b border-zinc-800 py-4">
                  <Link
                    to={`/profile/${pin.postedBy?._id || pin.postedBy}`}
                    className="flex items-center space-x-3 cursor-pointer hover:opacity-85 transition-opacity"
                  >
                    <img
                      src={pin.postedBy?.avatar || "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg"}
                      alt={pin.postedBy?.username}
                      className="h-10 w-10 rounded-full object-cover border border-zinc-800"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-white">
                        {pin.postedBy?.username || "pinstacker"}
                      </span>
                      <span className="text-xs text-zinc-500">{followersCount} followers</span>
                    </div>
                  </Link>

                  {user?._id !== (pin.postedBy?._id || pin.postedBy) && (
                    <button
                      onClick={handleFollowToggle}
                      className={`rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                        isFollowing
                          ? "bg-zinc-800 border border-zinc-700 text-white"
                          : "bg-[#E60023] text-white hover:bg-[#b8001c]"
                      }`}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              </div>

              {/* Comment Section */}
              <div className="mt-6 pt-6 border-t border-zinc-800">
                <CommentSection
                  pinId={pin._id}
                  initialComments={pin.comments || []}
                  onCommentAdded={(comments) => {
                    setPin({ ...pin, comments });
                  }}
                  onCommentDeleted={(comments) => {
                    setPin({ ...pin, comments });
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PinDetails;
