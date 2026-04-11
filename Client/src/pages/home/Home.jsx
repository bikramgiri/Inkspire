import { useEffect, useState } from "react";
import BlogCard from "../../components/Blog/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../store/blog/blogSlice";
import { STATUSES } from "../../global/status";
import { Loader2 } from "lucide-react";

export default function Home() {
  const dispatch = useDispatch();
  const { blogs, status } = useSelector((state) => state.blog);
  const [activeTab, setActiveTab] = useState("for-you");

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  if (status === STATUSES.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center gap-8 border-b border-gray-200 sticky top-19 z-10 bg-white">
        {[
          { id: "for-you", label: "For you" },
          { id: "featured", label: "Featured" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`cursor-pointer pb-3 text-md font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? "text-gray-900 border-gray-900"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {blogs.map((blog) => {
          const renderAvatar = (size) => {
            const avatarSize = size === "small" ? "w-10 h-10" : "w-12 h-12";
            const textSize = size === "small" ? "text-xl" : "text-2xl";

            if (blog.author?.avatar) {
              return (
                <img
                  className={`${avatarSize} rounded-full object-cover border-2 border-blue-200`}
                  src={blog.author?.avatar}
                  alt={`${blog.author}'s avatar`}
                />
              );
            }

            const initials = blog.author?.charAt(0).toUpperCase() || "U";

            return (
              <div
                className={`${avatarSize} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-blue-200 ${textSize}`}
              >
                {initials}
              </div>
            );
          };
          return (
            <div key={blog._id || blog.id}>
              <BlogCard blog={blog} renderAvatar={renderAvatar} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
