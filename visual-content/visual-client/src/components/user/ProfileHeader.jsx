import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import toast from "react-hot-toast";
import { FaEdit, FaCheck, FaTimes, FaCamera } from "react-icons/fa";

const ProfileHeader = ({ profile, onProfileUpdated }) => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(profile.bio || "");
  const [username, setUsername] = useState(profile.username || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile.avatar);
  const [saving, setSaving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(
    user && profile.followers ? profile.followers.some((f) => (f._id || f) === user._id) : false
  );
  const [followersCount, setFollowersCount] = useState(profile.followersCount || 0);

  const isOwnProfile = user ? user._id === profile._id : false;

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleFollowToggle = async () => {
    try {
      const response = await axiosInstance.put(`/users/follow/${profile._id}`);
      if (response.data.success) {
        setIsFollowing(response.data.isFollowing);
        setFollowersCount(response.data.followersCount);
        toast.success(response.data.isFollowing ? `Following ${profile.username}` : `Unfollowed ${profile.username}`);
      }
    } catch (error) {
      toast.error("Failed to follow user");
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setSaving(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    try {
      const response = await axiosInstance.put("/users/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        setUser(response.data.user);
        setIsEditing(false);
        if (onProfileUpdated) {
          onProfileUpdated(response.data.user);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setBio(profile.bio || "");
    setUsername(profile.username || "");
    setAvatarPreview(profile.avatar);
    setAvatarFile(null);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-5 border-b border-zinc-800 pb-10">
      {/* Visual Avatar */}
      <div className="relative">
        <img
          src={avatarPreview}
          alt={profile.username}
          className="h-32 w-32 rounded-full border-4 border-zinc-800 object-cover shadow-lg"
          onError={(e) => {
            e.target.src = "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg";
          }}
        />
        {isOwnProfile && isEditing && (
          <label className="absolute bottom-1 right-1 cursor-pointer rounded-full bg-[#E60023] p-2.5 text-white shadow-lg transition-transform hover:scale-105">
            <FaCamera className="h-4.5 w-4.5" />
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="flex flex-col items-center space-y-4 w-full max-w-sm">
          {/* Editing Inputs */}
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-sm text-white focus:border-zinc-700 outline-none"
            placeholder="Username"
          />
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows="2"
            maxLength="160"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-center text-xs text-zinc-300 focus:border-zinc-700 outline-none resize-none"
            placeholder="Write a short biography..."
          />
          
          <div className="flex items-center space-x-3 mt-1">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center space-x-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white"
            >
              <FaTimes className="h-3 w-3" />
              <span>Cancel</span>
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-1.5 rounded-full bg-green-600 px-4 py-2 text-xs font-semibold text-white hover:bg-green-700 active:scale-95 transition-all"
            >
              {saving ? (
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
              ) : (
                <FaCheck className="h-3 w-3" />
              )}
              <span>Save</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col items-center space-y-3">
          {/* Display Info */}
          <div className="flex items-center space-x-2">
            <h1 className="text-3xl font-extrabold text-white">{profile.username}</h1>
            {isOwnProfile && (
              <button
                onClick={() => setIsEditing(true)}
                className="rounded-full bg-zinc-900 border border-zinc-800/80 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Edit Profile"
              >
                <FaEdit className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <p className="max-w-md text-center text-sm leading-relaxed text-zinc-300">
            {profile.bio || (isOwnProfile ? "You haven't added a bio yet. Click the edit icon to personalize your profile!" : "This explorer hasn't added a bio yet.")}
          </p>

          {/* Social Counts */}
          <div className="flex items-center gap-4 text-xs font-semibold text-zinc-400">
            <div>
              <span className="font-bold text-white">{followersCount}</span> followers
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-800"></div>
            <div>
              <span className="font-bold text-white">{profile.followingCount || 0}</span> following
            </div>
          </div>

          {/* Follow Button */}
          {!isOwnProfile && (
            <button
              onClick={handleFollowToggle}
              className={`rounded-full px-6 py-2.5 text-sm font-bold transition-all active:scale-95 duration-200 cursor-pointer ${
                isFollowing
                  ? "bg-zinc-800 border border-zinc-700 text-white"
                  : "bg-[#E60023] text-white hover:bg-[#b8001c]"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;
