import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClickOutside from '../ClickOutside';
import { ChevronDown, LogOut, Settings } from "lucide-react";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '../../utils/toast';
import { logOut } from '../../store/auth/authSlice';

const DropdownUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const storedToken = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  
  const effectiveToken = token || storedToken;
  const effectiveUser = user || storedUser;

  const isLoggedIn = !!effectiveToken && !!effectiveUser;

  const handleLogOut = () => {
    dispatch(logOut());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    toast("Logged out successfully!", "success");
    navigate("/login?logout=true");
  };

  const renderAvatar = (size) => {
    const avatarSize = size === "small" ? "w-10 h-10" : "w-12 h-12";
    const textSize = size === "small" ? "text-xl" : "text-2xl";

    if (effectiveUser?.avatar) {
      return (
        <img
          className={`${avatarSize} rounded-full object-cover border-2 border-blue-200`}
          src={effectiveUser.avatar}
          alt="User avatar"
        />
      );
    }

    const initials = effectiveUser?.username?.charAt(0).toUpperCase() || "U";

    return (
      <div
        className={`${avatarSize} rounded-full bg-blue-700 text-white flex items-center justify-center font-bold border-2 border-indigo-200 ${textSize}`}
        alt="User avatar"
      >
        {initials}
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <>
      <Link
        to="/login"
        className="cursor-pointer flex rounded-lg px-5 py-2 text-base font-medium text-indigo-700 border-2 border-indigo-700 hover:bg-indigo-50 transition-colors"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="cursor-pointer flex rounded-lg px-5 py-2 text-base font-medium bg-indigo-500 text-white border border-indigo-700 hover:bg-indigo-700 transition-colors"
      >
        Register
      </Link>
      </>
    );
  }

  return (
    <ClickOutside onClick={() => setDropdownOpen(false)} className="relative">
      <Link
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="cursor-pointer flex items-center gap-4"
        to="#"
      >
        <span className="rounded-full">{renderAvatar('large')}</span>

        <span className="hidden text-left lg:block">
          <span className="block text-sm font-medium text-black">
            {effectiveUser?.username || 'Admin User'}
          </span>
          <span className="block text-xs text-gray-500">
            {effectiveUser?.email || 'admin@gmail.com'}
          </span>
        </span>

        <ChevronDown
          className={`hidden sm:block transition-transform duration-200 ${
            dropdownOpen ? 'rotate-180' : ''
          }`}
          size={20}
        />
      </Link>

      {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-66 bg-white rounded-md shadow-xl border border-gray-300 py-2 z-50">
          <div className="px-5 py-4 border-b border-gray-300">
            <div className="flex items-center gap-3">
              {renderAvatar('large')}
              <div>
                <p className="font-medium text-gray-900">
                  {effectiveUser?.username || 'Admin User'}
                </p>
                <p className="text-sm text-gray-600 truncate max-w-48">
                  {effectiveUser?.email || 'admin@gmail.com'}
                </p>
              </div>
            </div>
          </div>

          <div className="py-2">
            {/* <Link
              to="/profile"
              className="flex gap-3 items-center px-5 py-2.5 text-gray-900 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <CgProfile className="h-6 w-6" />
              Profile
            </Link> */}
            <Link
              to="/settings"
              className="flex gap-3 items-center px-5 py-2.5 text-gray-900 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              onClick={() => setDropdownOpen(false)}
            >
              <Settings className="h-6 w-6" />
              Settings
            </Link>
          </div>

          <div className="border-t border-gray-300 pt-2">
            <button
              onClick={handleLogOut}
              className="focus:outline-none focus:ring-0 flex w-full px-5 py-2 gap-3 cursor-pointer items-center text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-6 w-6" />
              Log out
            </button>
          </div>
        </div>
      )}
    </ClickOutside>
  );
};

export default DropdownUser;