import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../app/store";
import axiosInstance from "../api/axios";
import Navbar from "../components/common/Navbar";
import { FaCloudUploadAlt, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";

const categories = ["Tech", "Art", "Design", "Nature", "Food", "Travel"];

const Upload = () => {
  const { addPin } = useStore();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Tech");
  const [tags, setTags] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileSelect = (file) => {
    if (!file) return;

    // Client-side image validation
    if (!file.type.startsWith("image/")) {
      toast.error("Invalid file format. Please select an image!");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size is too large. Limit is 5MB!");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleClearImage = (e) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !imageFile || !category) {
      toast.error("Title, Category, and Image are required!");
      return;
    }

    setPublishing(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("tags", tags);
    formData.append("image", imageFile);

    try {
      const response = await axiosInstance.post("/pins", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        toast.success("Pin created successfully!");
        addPin(response.data.pin);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to publish Pin");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
            
            {/* Left Side: Drag-and-drop Image Uploader */}
            <div className="md:w-1/2 flex flex-col">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-3">Upload Image</span>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl p-6 min-h-[300px] cursor-pointer transition-all duration-300 ${
                  imagePreview
                    ? "border-zinc-800 bg-zinc-950/50"
                    : isDragOver
                    ? "border-[#E60023] bg-[#E60023]/5"
                    : "border-zinc-800 hover:border-zinc-700 bg-zinc-950"
                }`}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-2xl group">
                    <img src={imagePreview} alt="Upload preview" className="max-h-[350px] w-full object-contain rounded-2xl" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={handleClearImage}
                        className="rounded-full bg-red-600 hover:bg-red-700 p-3.5 text-white transition-all scale-95 group-hover:scale-100"
                        title="Delete image"
                      >
                        <FaTrash className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <div className="flex justify-center">
                      <FaCloudUploadAlt className={`h-12 w-12 transition-colors ${isDragOver ? "text-[#E60023]" : "text-zinc-500"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-zinc-300">Drag & drop image here</p>
                      <p className="text-xs text-zinc-500 mt-1">or click to browse local files</p>
                    </div>
                    <div className="text-[10px] text-zinc-500 max-w-[200px] mx-auto border-t border-zinc-800/80 pt-3">
                      Supports: JPG, PNG, GIF, WEBP.
                      Max upload size: 5MB
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>
            </div>

            {/* Right Side: Detailed Forms */}
            <form onSubmit={handleSubmit} className="md:w-1/2 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Title */}
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Add your title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-600 py-2.5 text-xl font-extrabold outline-none text-white placeholder-zinc-600 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <textarea
                    placeholder="Tell everyone what your Pin is about..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full bg-transparent border-b border-zinc-800 focus:border-zinc-600 py-2 text-sm outline-none text-zinc-300 placeholder-zinc-600 transition-colors resize-none"
                  />
                </div>

                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-300 outline-none focus:border-zinc-700 transition-colors cursor-pointer"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Tags</label>
                  <input
                    type="text"
                    placeholder="design, tech, workspace (separated by commas)"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 outline-none focus:border-zinc-700 transition-colors"
                  />
                </div>
              </div>

              {/* Submit trigger */}
              <div className="pt-4 border-t border-zinc-800/80">
                <button
                  type="submit"
                  disabled={publishing || !title.trim() || !imageFile}
                  className="w-full flex justify-center py-3.5 px-4 rounded-xl text-sm font-extrabold text-white bg-[#E60023] hover:bg-[#b8001c] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed active:scale-98 transition-all shadow-lg hover:shadow-[#E60023]/25"
                >
                  {publishing ? (
                    <span className="flex items-center space-x-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      <span>Publishing Pin Stack...</span>
                    </span>
                  ) : (
                    "Publish Pin"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
