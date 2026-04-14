import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2, Pencil } from "lucide-react";
import BlogCard from "../../../components/Blog/BlogCard";
import { fetchMyBlogs } from "../../../store/blog/blogSlice";
import { STATUSES } from "../../../global/status";
import {
  AddToLibrary,
  fetchUserLibrary,
  removeFromLibrary,
} from "../../../store/library/librarySlice";
import { toast } from "../../../utils/toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MyBlog() {
      const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blogs, status } = useSelector((state) => state.blog);
  const { library } = useSelector((state) => state.library);
  const [activeTab, setActiveTab] = useState("my-blogs");

  useEffect(() => {
    dispatch(fetchMyBlogs());
    dispatch(fetchUserLibrary());
  }, [dispatch]);

  if (status === STATUSES.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <>
      {/* {!blogs || blogs.length === 0 ? (
        <section className="py-40 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-indigo-700 mb-6">
              Your Blog List is Empty
            </h1>
            <p className="text-lg text-gray-700 mb-10">
              Looks like you haven't added any blogs yet.
            </p>
            <button
                  onClick={() => navigate("/add-blog")}
                  className="cursor-pointer inline-block px-4 py-3 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition-colors"
                >
                  <Pencil className="w-5 h-5 inline-block mr-2" />
                  Create Your First Blog
                </button>
          </div>
        </section>
      ) : ( */}
        <div className="max-w-4xl">
          <div className="flex items-center gap-8 border-b border-gray-200 sticky top-19 z-10 bg-white">
            {/* <h1 className="text-3xl font-bold text-gray-900 py-4">My Blogs</h1> */}
            {[
              { id: "my-blogs", label: "My Blogs" },
              { id: "about", label: "About" },
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



{activeTab === "about" ? (
  <div className="flex flex-col items-center justify-center py-30 px-4 max-w-6xl">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">
      Tell the world about yourself
    </h2>
    <p className="text-gray-500 text-base text-center mb-8">
      Share your passions, experiences, and what inspires you to write. Let readers connect with the person behind the words and discover what makes your perspective unique.
    </p>
    <button
      onClick={() => navigate("/edit-profile")}
      className="cursor-pointer px-5 py-2.5 border border-gray-800 text-gray-800 font-medium rounded-full hover:bg-gray-50 transition-colors"
    >
      Get started
    </button>
  </div>
) : !blogs || blogs.length === 0 ? (
        <section className="py-40 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-indigo-700 mb-6">
              Your Blog List is Empty
            </h1>
            <p className="text-lg text-gray-700 mb-10">
              Looks like you haven't added any blogs yet.
            </p>
            <button
                  onClick={() => navigate("/add-blog")}
                  className="cursor-pointer inline-block px-4 py-3 bg-indigo-600 text-white font-medium rounded hover:bg-indigo-700 transition-colors"
                >
                  <Pencil className="w-5 h-5 inline-block mr-2" />
                  Create Your First Blog
                </button>
          </div>
        </section>
      ) : (
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

                const initials =
                  blog.author?.username.charAt(0).toUpperCase() || "U";

                return (
                  <div
                    className={`${avatarSize} rounded-full bg-blue-600 text-white flex items-center justify-center font-bold border-2 border-blue-200 ${textSize}`}
                  >
                    {initials}
                  </div>
                );
              };

              const isLibraried = library.some(
                // Check if the current blog is in the library
                (lib) => lib._id === blog._id || lib.id === blog._id,
              );

              const handleLibraryToggle = () => {
                try {
                  if (isLibraried) {
                    dispatch(removeFromLibrary(blog._id));
                    toast("Blog removed from library.", "success");
                  } else {
                    dispatch(AddToLibrary(blog._id));
                    toast("Blog added to library.", "success");
                  }
                } catch {
                  toast("Something went wrong.", "error");
                }
              };

              return (
                <div key={blog._id || blog.id}>
                  <BlogCard
                    blog={blog}
                    renderAvatar={renderAvatar}
                    isLibraried={isLibraried}
                    handleLibraryToggle={handleLibraryToggle}
                  />
                </div>
              );
            })}
          </div>
          )} 
        </div>
    </>
  );
}
