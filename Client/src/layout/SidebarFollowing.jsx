import { UsersIcon } from "lucide-react";
import { useSidebar } from "../context/SidebarContext";

const followingUsers = [
  {
    name: "Stackademic",
    initial: "S",
    color: "bg-gray-900 text-white",
    active: true,
  },
  {
    name: "Level Up Coding",
    initial: "co",
    color: "bg-indigo-500 text-white",
    active: true,
  },
  {
    name: "Mohit Vaswani",
    initial: "M",
    color: "bg-orange-400 text-white",
    active: true,
  },
  {
    name: "Ai studio",
    initial: "N",
    color: "bg-gray-800 text-white",
    active: true,
  },
  {
    name: "Entrepreneurshi...",
    initial: "EH",
    color: "bg-gray-700 text-white",
    active: true,
  },
  {
    name: "JOKEN VILLAN...",
    initial: "J",
    color: "bg-pink-500 text-white",
    active: true,
  },
  {
    name: "Personal Growth",
    initial: "PG",
    color: "bg-pink-400 text-white",
    active: true,
  },
  {
    name: "Flutter",
    initial: "F",
    color: "bg-blue-400 text-white",
    active: true,
  },
  {
    name: "Chris Davidson",
    initial: "C",
    color: "bg-amber-400 text-white",
    active: true,
  },
];

export default function SidebarFollowing() {
  const { isExpanded, isMobileOpen, isHovered } = useSidebar();

  return (
    <div className="mt-6 border-t border-gray-300">
      <div className="flex items-center">
        {isExpanded || isHovered || isMobileOpen ? (
          <div className="flex-shrink-0 px-3 pt-3">
            <p className="flex gap-3 px-3 text-lg font-semibold text-gray-600 tracking-wider mb-3">
              <UsersIcon className="w-5 h-5" />
              Following
            </p>
            <div className="space-y-1">
              {followingUsers.map((user) => (
                <button
                  key={user.name}
                  className="cursor-pointer flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-300 transition-colors group"
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${user.color}`}
                  >
                    {user.initial}
                  </span>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="text-sm text-gray-600 truncate flex-1 text-left">
                      {user.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="min-w-0">
            {/* <p className="px-3 text-lg font-semibold text-gray-600 tracking-wider mb-3">Follo</p>
             */}
            <p className="justify-items-center mb-3 pt-4">
              <UsersIcon className="w-5 h-5" />
            </p>
            {!isExpanded && !isHovered && isMobileOpen && (
              <p className="flex gap-3 px-3 text-lg font-semibold text-gray-600 tracking-wider mb-3">
                <UsersIcon className="w-5 h-5" />
                Following
              </p>
            )}
            <div className="space-y-1">
              {followingUsers.map((user) => (
                <button
                  key={user.name}
                  className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group
                ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                >
                  <span
                    className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${user.color}`}
                  >
                    {user.initial}
                  </span>

                  {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="text-sm text-gray-600 truncate flex-1 text-left">
                      {user.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
