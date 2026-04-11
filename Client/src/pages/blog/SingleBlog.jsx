import { Bookmark, MessageSquare, ShareIcon, ThumbsUp } from "lucide-react";
import { useEffect, useState } from "react";
import { STATUSES } from "../../global/status";
import { fetchSingleBlog } from "../../store/blog/blogSlice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const HeroImage = () => (
  <div className="w-full aspect-video rounded-sm overflow-hidden bg-gradient-to-br from-blue-950 via-indigo-900 to-blue-800 flex items-center justify-center relative">
    {/* Stars */}
    {[...Array(30)].map((_, i) => (
      <div
        key={i}
        className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.6 + 0.2,
        }}
      />
    ))}
    {/* Glow orbs */}
    <div className="absolute top-4 left-1/3 w-32 h-32 bg-cyan-400 rounded-full opacity-10 blur-3xl" />
    <div className="absolute bottom-8 right-1/4 w-24 h-24 bg-blue-400 rounded-full opacity-15 blur-2xl" />
    {/* Person silhouette at desk */}
    <svg
      viewBox="0 0 500 300"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Monitor */}
      <rect
        x="140"
        y="60"
        width="200"
        height="140"
        rx="8"
        fill="#1e3a5f"
        stroke="#3b82f6"
        strokeWidth="2"
      />
      <rect x="148" y="68" width="184" height="124" rx="4" fill="#0f2744" />
      {/* Screen glow lines */}
      <rect
        x="155"
        y="80"
        width="120"
        height="6"
        rx="2"
        fill="#38bdf8"
        opacity="0.5"
      />
      <rect
        x="155"
        y="92"
        width="80"
        height="4"
        rx="2"
        fill="#64748b"
        opacity="0.4"
      />
      <rect
        x="155"
        y="102"
        width="100"
        height="4"
        rx="2"
        fill="#64748b"
        opacity="0.4"
      />
      <rect
        x="155"
        y="112"
        width="60"
        height="4"
        rx="2"
        fill="#3b82f6"
        opacity="0.5"
      />
      <rect
        x="155"
        y="130"
        width="140"
        height="20"
        rx="4"
        fill="#1d4ed8"
        opacity="0.6"
      />
      {/* Monitor stand */}
      <rect x="225" y="200" width="30" height="20" rx="2" fill="#1e3a5f" />
      <rect x="200" y="218" width="80" height="6" rx="3" fill="#1e3a5f" />
      {/* Laptop */}
      <rect
        x="270"
        y="170"
        width="130"
        height="85"
        rx="6"
        fill="#1e3a5f"
        stroke="#3b82f6"
        strokeWidth="1.5"
      />
      <rect x="278" y="178" width="114" height="69" rx="3" fill="#0f2744" />
      <rect x="255" y="254" width="160" height="8" rx="4" fill="#1e3a5f" />
      {/* Desk */}
      <rect x="60" y="258" width="400" height="12" rx="4" fill="#1a2e4a" />
      {/* Coffee cup */}
      <rect
        x="90"
        y="235"
        width="28"
        height="24"
        rx="4"
        fill="#7c3aed"
        opacity="0.7"
      />
      <path
        d="M118 243 Q130 243 130 249 Q130 255 118 255"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2"
        opacity="0.7"
      />
      {/* Person */}
      <circle cx="390" cy="140" r="28" fill="#1e293b" />
      <path
        d="M362 200 Q370 168 390 165 Q410 168 418 200 L420 260 L360 260 Z"
        fill="#1e293b"
      />
      {/* Floating icons */}
      <circle cx="100" cy="110" r="22" fill="#1d4ed8" opacity="0.8" />
      <text x="91" y="116" fontSize="18" fill="white">
        ⚙️
      </text>
      <circle cx="430" cy="80" r="18" fill="#0369a1" opacity="0.8" />
      <text x="422" y="86" fontSize="14" fill="white">
        ✉️
      </text>
      <circle cx="80" cy="185" r="18" fill="#0369a1" opacity="0.7" />
      <text x="72" y="191" fontSize="14" fill="white">
        ☁️
      </text>
    </svg>
    <p className="sr-only">
      Illustration of a developer working at a desk with floating UI icons
    </p>
  </div>
);

export default function SingleBlog() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleBlog: blog, status } = useSelector((state) => state.blog);

  const clapCount = blog.claps || 12;
  const commentCount = blog.comments ? blog.comments.length : 8;
  const [clapped, setClapped] = useState(false);
  const [claps, setClaps] = useState(clapCount);
  const [bookmarked, setBookmarked] = useState(false);

  const handleClap = () => {
    setClapped((c) => !c);
    setClaps((n) => (clapped ? n - 1 : n + 1));
  };

  useEffect(() => {
    dispatch(fetchSingleBlog(id));
  }, [dispatch, id]);

  const formattedDate = new Date(blog.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

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

  if (status === STATUSES.LOADING || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Loading blog...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-white font-serif">
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <h1
          className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-6 tracking-tight"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {blog.title}
        </h1>

        <div className="flex items-center gap-3 mb-4">
          {renderAvatar("large")}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900 hover:underline cursor-pointer">
                {blog.author || "Unknown Author"}
              </span>
              <button className="text-sm text-gray-700 font-medium border border-gray-700 rounded-full px-3 py-1 hover:bg-green-50 transition-colors leading-none">
                Follow
              </button>
            </div>
            <div className="items-center text-sm text-gray-500 mt-0.5">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        <div className="w-full mb-2 rounded-sm overflow-hidden items-center justify-center relative">
          <img
            src={blog.imageUrl}
            alt="Blog thumbnail"
            className="object-cover"
          />
        </div>

        <div className="flex items-center justify-between border-t border-b border-gray-200 py-3 mb-4">
          <div className="flex items-center gap-4 text-gray-500">
            <button
              onClick={handleClap}
              className={`flex items-center gap-1.5 transition-colors hover:text-gray-800 ${clapped ? "text-gray-900" : ""}`}
            >
              <ThumbsUp filled={clapped} />
              <span className="text-sm">{claps}</span>
            </button>
            <button className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
              <MessageSquare />
              <span className="text-sm">{commentCount}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 text-gray-500">
            <button
              onClick={() => setBookmarked((b) => !b)}
              className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${bookmarked ? "text-gray-900" : ""}`}
            >
              <Bookmark filled={bookmarked} />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <ShareIcon />
            </button>
          </div>
        </div>

        {/* ── Intro italic ── */}
        {/* <p
          className="text-xl text-gray-700 italic mb-8 leading-relaxed"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {blog.description}
        </p> */}

        {/* ── Body paragraphs ── */}
        {/* <div className="space-y-5">
          {blog.body.map((para, i) => (
            <p
              key={i}
              className="text-lg text-gray-800 leading-8"
              style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {para}
            </p>
          ))}
        </div> */}

        <div className="space-y-5">
          <p
            className="text-lg text-gray-800 leading-8"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            {blog.description}
          </p>
        </div>

        {/* ── Bottom engagement ── */}
        {/* <div className="flex items-center gap-4 mt-12 pt-6 border-t border-gray-200 text-gray-500">
          <button
            onClick={handleClap}
            className={`flex items-center gap-2 transition-colors hover:text-gray-900 ${clapped ? "text-gray-900" : ""}`}
          >
            <ThumbsUp filled={clapped} />
            <span className="text-sm">{claps}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-gray-900 transition-colors">
            <MessageSquare />
            <span className="text-sm">{commentCount}</span>
          </button>
        </div> */}
      </main>
    </div>
  );
}
