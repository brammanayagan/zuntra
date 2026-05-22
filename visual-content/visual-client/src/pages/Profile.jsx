import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axios";
import Navbar from "../components/common/Navbar";
import Loader from "../components/common/Loader";
import ProfileHeader from "../components/user/ProfileHeader";
import UserPins from "../components/user/UserPins";
import SavedPins from "../components/user/SavedPins";
import PinModal from "../components/pin/PinModal";
import { FaHeart, FaImages } from "react-icons/fa";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created"); // "created" or "saved"

  const isOwnProfile = user ? user._id === id : false;

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/users/${id}`);
      if (response.data.success) {
        setProfileData(response.data.profile);
      }
    } catch (error) {
      console.error("Failed to load user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, user]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {loading ? (
          <div className="flex h-[60vh] items-center justify-center">
            <Loader />
          </div>
        ) : !profileData ? (
          <div className="text-center py-20 text-zinc-500 text-sm">User profile not found.</div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Header section */}
            <ProfileHeader
              profile={profileData}
              onProfileUpdated={(updated) => {
                setProfileData({ ...profileData, ...updated });
              }}
            />

            {/* Custom Tab Toggles */}
            <div className="flex justify-center border-b border-zinc-800">
              <div className="flex space-x-6 text-sm font-bold tracking-wide">
                <button
                  onClick={() => setActiveTab("created")}
                  className={`flex items-center space-x-1.5 pb-4 border-b-2 transition-all cursor-pointer ${
                    activeTab === "created"
                      ? "border-[#E60023] text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <FaImages className="h-4 w-4" />
                  <span>Created ({profileData.createdPins?.length || 0})</span>
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center space-x-1.5 pb-4 border-b-2 transition-all cursor-pointer ${
                    activeTab === "saved"
                      ? "border-[#E60023] text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <FaHeart className="h-3.5 w-3.5" />
                  <span>Saved ({profileData.savedPins?.length || 0})</span>
                </button>
              </div>
            </div>

            {/* Feeds render pane */}
            <div className="pt-2">
              {activeTab === "created" ? (
                <UserPins pins={profileData.createdPins || []} isOwnProfile={isOwnProfile} />
              ) : (
                <SavedPins pins={profileData.savedPins || []} isOwnProfile={isOwnProfile} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Global detailed overlay modal */}
      <PinModal />
    </div>
  );
};

export default Profile;
