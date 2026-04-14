import { useEffect } from "react";
import BlogCard from "../../components/Blog/BlogCard";
import { useDispatch, useSelector } from "react-redux";
import { STATUSES } from "../../global/status";
import { Loader2 } from "lucide-react";
import { AddToLibrary, fetchUserLibrary, removeFromLibrary } from "../../store/library/librarySlice";
import { toast } from "../../utils/toast";

export default function Library() {
  const dispatch = useDispatch();
  const {library} = useSelector((state) => state.library);

  useEffect(() => {
    dispatch(fetchUserLibrary());
  }, [dispatch]);

//   if (status === STATUSES.LOADING) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

  return (
    <>
      {!library || library.length === 0 ? (
        <section className="py-40 bg-white">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-indigo-700 mb-6">
              Your Library List is Empty
            </h1>
            <p className="text-lg text-gray-700 mb-10">
              Looks like you haven't added any blogs to your library yet.
            </p>
          </div>
        </section>
      ) : (
        <div className="max-w-6xl">
          <div className="flex items-center gap-8 border-b border-gray-200 sticky top-19 z-10 bg-white">
            <h1 className="text-3xl font-bold text-gray-900 py-4">
              My Library
            </h1>
          </div>

          <div>
            {library.map((blog) => {
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
                    toast("Removed from library.", "success");
                  } else {
                    dispatch(AddToLibrary(blog._id));
                    toast("Added to library.", "success");
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
        </div>
      )}
    </>
  );
}
