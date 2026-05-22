import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useStore from "../../app/store";
import SaveButton from "./SaveButton";
import axiosInstance from "../../api/axios";
import { FaHeart, FaRegHeart, FaArrowCircleDown, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const PinCard = ({ pin }) => {
  const { user, isAuthenticated } = useAuth();
  const { setSelectedPin, removePin } = useStore();
  const [likes, setLikes] = useState(pin.likes || []);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const isLiked = user ? likes.includes(user._id) : false;
  const isCreator = user ? pin.postedBy?._id === user._id || pin.postedBy === user._id : false;

  const resolveImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    // Resolve relative path uploads to localhost:5000 during local dev
    return `http://localhost:5000${img}`;
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

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
      console.error("Like pin error:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm("Are you sure you want to delete this Pin?")) return;

    try {
      const response = await axiosInstance.delete(`/pins/${pin._id}`);
      if (response.data.success) {
        toast.success("Pin deleted!");
        removePin(pin._id);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete Pin");
    }
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
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
    <div
      onClick={() => setSelectedPin(pin)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative cursor-pointer overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
    >
      {/* Visual Image */}
      <img
        src={resolveImageUrl(pin.image)}
        alt={pin.title}
        loading="lazy"
        className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        onError={(e) => {
          e.target.src = "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg";
        }}
      />

      {/* Interactive Overlay on Hover */}
      <div className="absolute inset-0 flex flex-col justify-between bg-black/40 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        {/* Top bar (Save button) */}
        <div className="flex justify-between items-center w-full">
          <div className="text-white text-xs font-bold bg-zinc-950/70 backdrop-blur-md px-3 py-1.5 rounded-full">
            {pin.category}
          </div>
          <SaveButton pinId={pin._id} initialSaves={pin.saves} />
        </div>

        {/* Bottom bar (Like, Download, Delete actions) */}
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Like */}
            <button
              onClick={handleLike}
              className="rounded-full bg-zinc-900/80 backdrop-blur-md p-2.5 text-white hover:bg-zinc-800 hover:text-red-500 transition-colors"
            >
              {isLiked ? <FaHeart className="h-4 w-4 text-red-500" /> : <FaRegHeart className="h-4 w-4" />}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="rounded-full bg-zinc-900/80 backdrop-blur-md p-2.5 text-white hover:bg-zinc-800 hover:text-green-500 transition-colors"
              title="Download image"
            >
              <FaArrowCircleDown className="h-4 w-4" />
            </button>
          </div>

          {/* Delete (if author) */}
          {isCreator && (
            <button
              onClick={handleDelete}
              className="rounded-full bg-red-600/80 backdrop-blur-md p-2.5 text-white hover:bg-red-700 transition-colors"
              title="Delete Pin"
            >
              <FaTrash className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Info display (Title & Profile) below card for elegant layout */}
      <div className="p-3">
        <h3 className="truncate font-bold text-sm text-zinc-100 group-hover:text-white">
          {pin.title}
        </h3>
        <div className="mt-2 flex items-center justify-between text-xs text-zinc-400">
          <div
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/profile/${pin.postedBy?._id || pin.postedBy}`);
            }}
            className="flex items-center space-x-1.5 hover:text-white"
          >
            <img
              src={pin.postedBy?.avatar || "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg"}
              alt={pin.postedBy?.username}
              className="h-5 w-5 rounded-full object-cover border border-zinc-800"
            />
            <span className="font-semibold truncate max-w-[80px]">
              {pin.postedBy?.username || "pinstacker"}
            </span>
          </div>
          <span className="flex items-center space-x-1">
            <FaHeart className="h-3 w-3 text-red-500/70" />
            <span>{likes.length}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PinCard;
