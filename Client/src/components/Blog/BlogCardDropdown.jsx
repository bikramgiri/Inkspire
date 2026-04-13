import { Edit, Trash } from "lucide-react";
import { useEffect, useRef } from "react";

export default function BlogCardDropdown({ isOpen, onClose, onToggle, onEdit, onDelete }) {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        className="cursor-pointer p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-400"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        title="More options"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-[-70px] top-11 z-50 w-44 bg-white border border-gray-200 rounded-md shadow-md py-1">
          {/* Outer border triangle — centered */}
          <div
            className="absolute -top-[9px] left-1/2 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "9px solid transparent",
              borderRight: "9px solid transparent",
              borderBottom: "9px solid #e5e7eb",
            }}
          />
          {/* Inner white triangle — centered, slightly lower */}
          <div
            className="absolute -top-[7px] left-1/2 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: "7px solid transparent",
              borderRight: "7px solid transparent",
              borderBottom: "7px solid white",
            }}
          />

          <button
            className="cursor-pointer w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors border-b border-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
              onClose();
            }}
          >
            <Edit className="inline-block h-4 w-4 mr-2" />
            Edit blog
          </button>

          <button
            className="cursor-pointer w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
              onClose();
            }}
          >
            <Trash className="inline-block h-4 w-4 mr-2" />
            Delete blog
          </button>
        </div>
      )}
    </div>
  );
}