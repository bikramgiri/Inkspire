import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Bookmark, Calendar, MessageSquare, ThumbsUp } from "lucide-react";
import { ThumbnailPlaceholder } from "../icons/icons";
import BlogCardDropdown from "./BlogCardDropdown";
import { deleteBlog } from "../../store/blog/blogSlice";
import { toast } from "../../utils/toast";

export default function BlogCard({ blog, renderAvatar }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [bookmarked,    setBookmarked]    = useState(false);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [,    setIsDeleting]    = useState(false);

  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "—";

  const handleEdit = () => {
    navigate(`/edit-blog/${blog._id}`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    setIsDeleting(true);
    try {
      await dispatch(deleteBlog(blog._id));
      toast("Blog deleted successfully.", "success");
    } catch {
      toast("Failed to delete blog.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 py-6 px-0 cursor-pointer group">
      {/* Author row */}
      <div className="flex gap-6 items-center mb-3">
        <div className="flex items-center gap-2">
          {renderAvatar("large")}
          <span className="text-sm font-medium text-gray-800 hover:underline">
            {blog.author?.username || "Unknown Author"}
          </span>
        </div>
        <span className="text-gray-600 rounded-lg px-2.5 text-md border border-gray-400 bg-gray-50 hover:bg-gray-100 font-medium cursor-pointer">
          Follow
        </span>
      </div>

      {/* Card body */}
      <div
        onClick={() => navigate(`/blog/${blog._id}`)}
        className="flex items-start gap-4 justify-between"
      >
        {/* Left: title + description */}
        <div className="flex-1 min-w-0">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-1 group-hover:text-gray-700 transition-colors line-clamp-3 hover:underline cursor-pointer">
            {blog.title}
          </h2>
          {/* Strip HTML tags from description for preview */}
          <p className="text-md text-gray-700 line-clamp-2 hidden sm:block">
            {blog.description
              ? blog.description.replace(/<[^>]*>/g, "").substring(0, 400)
              : ""}
          </p>

          <div className="flex items-center justify-between mt-6">
            {/* Left: date, likes, comments */}
            <div className="flex items-center gap-4 text-gray-500 text-sm">
              <span className="flex gap-1 items-center">
                <Calendar className="h-4 w-4" />
                <span>{formattedDate}</span>
              </span>

              <button
                className="cursor-pointer flex items-center gap-1 hover:text-gray-800 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{blog.claps || 8}</span>
              </button>

              <button
                className="cursor-pointer flex items-center gap-1 hover:text-gray-800 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <MessageSquare className="h-4 w-4" />
                <span>{blog.comments?.length || 3}</span>
              </button>
            </div>

            {/* Right: bookmark + dropdown */}
            <div className="flex items-center gap-0.5 text-gray-400">
              <button
                className={`cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors ${
                  bookmarked ? "text-gray-900" : ""
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setBookmarked((b) => !b);
                }}
                title={bookmarked ? "Saved" : "Save"}
              >
                <Bookmark />
              </button>

              <BlogCardDropdown
                isOpen={dropdownOpen}
                onToggle={() => setDropdownOpen((prev) => !prev)}
                onClose={() => setDropdownOpen(false)}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          </div>
        </div>

        {/* Right: thumbnail */}
        {blog.imageUrl || blog.image ? (
          <img
            src={blog.imageUrl || blog.image}
            alt="Blog thumbnail"
            className="w-28 h-20 sm:w-40 sm:h-28 flex-shrink-0 rounded-sm object-cover"
          />
        ) : (
          <ThumbnailPlaceholder />
        )}
      </div>
    </div>
  );
}