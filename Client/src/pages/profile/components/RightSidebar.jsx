import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { followingUsers } from "../../../utils/helpers";

const footerLinks = [
  "Help", "Status", "About", "Careers", "Press",
  "Blog", "Privacy", "Rules", "Terms", "Text to speech",
];

export default function RightSidebar() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth); // adjust slice name as needed

  const renderAvatar = () => {
    if (user?.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.username}
          className="w-20 h-20 rounded-full object-cover"
        />
      );
    }
    const initial = user?.username?.charAt(0).toUpperCase() || "U";
    return (
      <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
        {initial}
      </div>
    );
  };

//   const renderFollowingAvatar = (person) => {
//     if (person?.avatar) {
//       return (
//         <img
//           src={person.avatar}
//           alt={person.username}
//           className="w-9 h-9 rounded-full object-cover flex-shrink-0"
//         />
//       );
//     }
//     const initial = person?.username?.charAt(0).toUpperCase() || "U";
//     return (
//       <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
//         {initial}
//       </div>
//     );
//   };

  return (
    <aside className="hidden lg:block w-72 xl:w-66 shrink-0 border-l border-gray-200 pl-6 pt-1 self-start sticky top-16">

      {/* ── Profile ── */}
      <div className="mb-8">
        <div className="mb-3">{renderAvatar()}</div>
        <h2 className="text-base font-bold text-gray-900">
          {user?.username || "User"}
        </h2>
        <p className="text-sm text-gray-500 mt-0.5 mb-3">
          {user?.bio || "Tech Enthusiast"}
        </p>
        <button
          onClick={() => navigate("/edit-profile")}
          className="text-sm font-medium text-green-600 hover:text-green-700 transition-colors"
        >
          Edit profile
        </button>
      </div>

      {/* ── Following ── */}
      {/* {followingUsers.length > 0 && (
        <div 
        className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Following</h3>

          <ul className="space-y-4">
            {followingUsers.slice(0, 5).map((person) => (
              <li
                key={person.name}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {renderFollowingAvatar(person)}
                  <span className="text-sm font-medium text-gray-800 truncate">
                    {person.username || person.name}
                  </span>
                </div>
                <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

          {followingUsers.length > 5 && (
            <button
              onClick={() => navigate("/following")}
              className="mt-4 text-sm text-green-600 hover:text-green-700 transition-colors"
            >
              See all ({followingUsers.length})
            </button>
          )}
        </div>
      )} */}

      {/* // or */}
        {followingUsers.length > 0 && ( 
        <div 
         key={user.name}
        className="mb-8">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Following</h3>

          <ul className="space-y-4">
            {followingUsers.slice(0, 7).map((user) => (
              <li
                key={user.name}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${user.color}`}
                  >
                    {user.initial}
                  </span>

                    <span className="text-sm text-gray-600 truncate flex-1 text-left">
                      {user.name}
                    </span>
                </div>
                <button className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>

          {followingUsers.length > 7 && (
            <button
              onClick={() => navigate("/following")}
              className="mt-4 text-sm text-green-600 hover:text-green-700 transition-colors"
            >
              See all ({followingUsers.length})
            </button>
          )}
        </div>
      )}

      {/* ── Footer links ── */}
      <div className="flex flex-wrap gap-x-2 gap-y-1">
        {footerLinks.map((link) => (
          <span
            key={link}
            className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
          >
            {link}
          </span>
        ))}
      </div>
    </aside>
  );
}