import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../api/axios";
import { FaTrash, FaPaperPlane } from "react-icons/fa";
import toast from "react-hot-toast";

const CommentSection = ({ pinId, initialComments = [], onCommentAdded, onCommentDeleted }) => {
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState(initialComments);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!isAuthenticated) {
      toast.error("Please log in to add comments!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axiosInstance.post(`/pins/comment/${pinId}`, {
        text: commentText,
      });

      if (response.data.success) {
        const newComment = response.data.comment;
        const updated = [...comments, newComment];
        setComments(updated);
        setCommentText("");
        toast.success("Comment added!");
        if (onCommentAdded) onCommentAdded(updated);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      const response = await axiosInstance.delete(`/pins/comment/${pinId}/${commentId}`);
      if (response.data.success) {
        const updated = comments.filter((c) => c._id !== commentId);
        setComments(updated);
        toast.success("Comment deleted!");
        if (onCommentDeleted) onCommentDeleted(updated);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const formatDate = (dateString) => {
    const options = { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="flex flex-col space-y-4 h-full">
      <h3 className="text-md font-bold text-white uppercase tracking-wider">
        Comments ({comments.length})
      </h3>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto max-h-[250px] pr-2 space-y-3 custom-scrollbar">
        {comments.length === 0 ? (
          <p className="text-sm text-zinc-500 italic mt-2">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => {
            const isCommentOwner = user ? comment.user?._id === user._id || comment.user === user._id : false;
            return (
              <div key={comment._id} className="flex items-start justify-between bg-zinc-900/40 border border-zinc-800/50 p-2.5 rounded-2xl group">
                <div className="flex space-x-2.5">
                  <img
                    src={comment.user?.avatar || "https://res.cloudinary.com/demo/image/upload/v1672531193/cld-sample-4.jpg"}
                    alt={comment.user?.username}
                    className="h-7 w-7 rounded-full object-cover border border-zinc-800"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-baseline space-x-2">
                      <span className="text-xs font-bold text-white">{comment.user?.username}</span>
                      <span className="text-[10px] text-zinc-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{comment.text}</p>
                  </div>
                </div>

                {isCommentOwner && (
                  <button
                    onClick={() => handleDelete(comment._id)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-500 p-1 rounded transition-opacity"
                    title="Delete Comment"
                  >
                    <FaTrash className="h-3 w-3" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Input box */}
      <form onSubmit={handleSubmit} className="border-t border-zinc-800 pt-3">
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder={isAuthenticated ? "Add a comment..." : "Log in to add a comment"}
            disabled={!isAuthenticated || submitting}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="w-full rounded-full border border-zinc-800 bg-zinc-900 py-2.5 pl-4 pr-12 text-xs text-white placeholder-zinc-500 outline-none focus:border-zinc-700"
          />
          <button
            type="submit"
            disabled={!isAuthenticated || submitting || !commentText.trim()}
            className="absolute right-2 p-2 rounded-full bg-[#E60023] hover:bg-[#b8001c] disabled:bg-zinc-800 text-white disabled:text-zinc-500 transition-colors"
          >
            <FaPaperPlane className="h-3 w-3" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentSection;
