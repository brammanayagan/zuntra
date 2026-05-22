import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";

const SaveButton = ({ pinId, initialSaves = [], onToggle }) => {
  const { user, isAuthenticated } = useAuth();
  const [saves, setSaves] = useState(initialSaves);
  const [loading, setLoading] = useState(false);

  const isSaved = user ? saves.includes(user._id) : false;

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please log in to save pins!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.put(`/pins/save/${pinId}`);
      if (response.data.success) {
        let updatedSaves;
        if (response.data.isSaved) {
          updatedSaves = [...saves, user._id];
          toast.success("Saved to your board!");
        } else {
          updatedSaves = saves.filter((id) => id !== user._id);
          toast.success("Removed from your board.");
        }
        setSaves(updatedSaves);
        if (onToggle) onToggle(response.data.isSaved);
      }
    } catch (error) {
      console.error("Save Pin error:", error);
      toast.error(error.response?.data?.message || "Failed to save pin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSave}
      disabled={loading}
      className={`rounded-full px-5 py-2.5 text-sm font-bold tracking-wide transition-all active:scale-95 duration-200 cursor-pointer ${
        isSaved
          ? "bg-zinc-800 text-white border border-zinc-700 hover:bg-zinc-700"
          : "bg-[#E60023] text-white hover:bg-[#b8001c]"
      }`}
    >
      {loading ? (
        <span className="flex items-center space-x-1">
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          <span>Saving</span>
        </span>
      ) : isSaved ? (
        "Saved"
      ) : (
        "Save"
      )}
    </button>
  );
};

export default SaveButton;
