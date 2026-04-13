import { Bookmark, MessageSquare, ShareIcon, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { STATUSES } from "../../global/status";
import { fetchSingleBlog } from "../../store/blog/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";

export default function SingleBlog() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleBlog: blog, status } = useSelector((state) => state.blog);

  const [clapped,    setClapped]    = useState(false);
  const [claps,      setClaps]      = useState(0);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    dispatch(fetchSingleBlog(id));
  }, [dispatch, id]);

  // Sync clap count when blog loads
  useEffect(() => {
    if (blog?.claps !== undefined) setTimeout(() => setClaps(blog.claps), 0);
  }, [blog?.claps]);

  const handleClap = () => {
    setClapped((c) => !c);
    setClaps((n) => (clapped ? n - 1 : n + 1));
  };

  /* ── loading / empty ── */
  if (status === STATUSES.LOADING || !blog || !blog._id) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  const formattedDate = blog.date
    ? new Date(blog.date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "—";

  const commentCount = Array.isArray(blog.comments) ? blog.comments.length : 0;

  /* ── avatar renderer ── */
  // FIX: blog.author is an object {name, avatar} — not a string
  const renderAvatar = (size) => {
    const dim  = size === "small" ? "w-10 h-10 text-xl" : "w-12 h-12 text-2xl";
    if (blog.author?.avatar) {
      return (
        <img
          className={`${dim} rounded-full object-cover border-2 border-blue-200`}
          src={blog.author.avatar}
          alt={blog.author.username || "Author"}
        />
      );
    }
    const initial = blog.author?.username?.charAt(0).toUpperCase() || "U";
    return (
      <div
        className={`${dim} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-blue-200`}
      >
        {initial}
      </div>
    );
  };

  return (
    <>
      {/* Styles for rendered HTML description */}
      <style>{`
        .blog-content h1 { font-size:2rem; font-weight:700; margin:1.25rem 0 0.5rem; }
        .blog-content h2 { font-size:1.5rem; font-weight:700; margin:1.1rem 0 0.45rem; }
        .blog-content h3 { font-size:1.25rem; font-weight:600; margin:1rem 0 0.4rem; }
        .blog-content h4 { font-size:1.1rem; font-weight:600; margin:0.9rem 0 0.35rem; }
        .blog-content h5 { font-size:1rem; font-weight:600; margin:0.75rem 0 0.3rem; }
        .blog-content h6 { font-size:0.875rem; font-weight:600; margin:0.75rem 0 0.3rem; color:#6b7280; }
        .blog-content p  { margin:0.5rem 0; }
        .blog-content blockquote {
          border-left:4px solid #e5e7eb; margin:1.25rem 0;
          padding:0.6rem 1.25rem; color:#6b7280; font-style:italic;
          font-size:1.1rem; background:#f9fafb; border-radius:0 8px 8px 0;
        }
        .blog-content ul { list-style:disc; padding-left:1.75rem; margin:0.5rem 0; }
        .blog-content ol { list-style:decimal; padding-left:1.75rem; margin:0.5rem 0; }
        .blog-content li { margin:0.25rem 0; }
        .blog-content a  { color:#2563eb; text-decoration:underline; }
        .blog-content img { max-width:100%; border-radius:12px; margin:1rem 0; }
      `}</style>

      <div className="bg-white font-serif">
        <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 tracking-tight"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {blog.title}
          </h1>

          {/* Author + date */}
          <div className="flex items-center gap-3 mb-6">
            {renderAvatar("large")}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 hover:underline cursor-pointer">
                  {/* FIX: use author.name */}
                  {blog.author?.name || "Unknown Author"}
                </span>
                <button className="text-sm text-gray-700 font-medium border border-gray-700 rounded-full px-3 py-1 hover:bg-green-50 transition-colors leading-none">
                  Follow
                </button>
              </div>
              <span className="text-sm text-gray-500 mt-0.5">{formattedDate}</span>
            </div>
          </div>

          {/* Cover image */}
          {blog.imageUrl && (
            <div className="w-full mb-6 rounded-xl overflow-hidden">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full object-cover max-h-96"
              />
            </div>
          )}

          {/* Engagement bar */}
          <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 mb-8">
            <div className="flex items-center gap-4 text-gray-500">
              <button
                onClick={handleClap}
                className={`flex items-center gap-1.5 transition-colors hover:text-gray-800 ${clapped ? "text-gray-900" : ""}`}
              >
                <ThumbsUp className="w-5 h-5" />
                <span className="text-sm">{claps || 8}</span>
              </button>
              <button className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">{commentCount || 2}</span>
              </button>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <button
                onClick={() => setBookmarked((b) => !b)}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${bookmarked ? "text-gray-900" : ""}`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <ShareIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Blog body — supports rich-text HTML from editor */}
          <div
            className="blog-content text-lg text-gray-800 leading-8"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
        </main>
      </div>
    </>
  );
}