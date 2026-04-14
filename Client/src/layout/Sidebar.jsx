import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import { Home, UserCircle2Icon, X } from "lucide-react";
import { LibraryIcon, StatsIcon } from "../components/icons/icons";
import SidebarFollowing from "./SidebarFollowing";

const navItems = [
  { icon: <Home />, name: "Home", path: "/" },
  { icon: <LibraryIcon />, name: "Library", path: "/library" },
  { icon: <UserCircle2Icon />, name: "Profile", path: "/profile" },
  // { icon: <StatsIcon />, name: "Stats", path: "/stats" },
];

const Sidebar = () => {
  const {
    isExpanded,
    isMobileOpen,
    isHovered,
    setIsHovered,
    toggleMobileSidebar,
  } = useSidebar();
  const location = useLocation();
  const sidebarRef = useRef(null);

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : null;

      if (!items) return; // skip "others" since you have no items there

      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType, index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setTimeout(() => setOpenSubmenu(null), 100);
    }
  }, [location]);

  useEffect(() => {
    if (openSubmenu) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key].scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index, menuType) => {
    setOpenSubmenu((prev) =>
      prev?.type === menuType && prev?.index === index
        ? null
        : { type: menuType, index },
    );
  };

  // Close mobile sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isMobileOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target)
      ) {
        toggleMobileSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileOpen, toggleMobileSidebar]);

  // Prevent body scroll when mobile sidebar open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  const activeClasses = `
    bg-blue-100 text-blue-700 border border-blue-300 rounded-lg font-semibold
  `;

  const inactiveClasses = `
    text-gray-800 hover:bg-gray-200
  `;

  const renderMenuItems = (items, menuType) => (
    <ul className="flex flex-col px-1.5 gap-4 text-gray-800 font-medium">
      {items.map((nav, index) => (
        <li
          key={nav.name}
          className={`rounded-lg transition-all duration-200 ${
            nav.path && isActive(nav.path) ? activeClasses : inactiveClasses
          }`}
        >
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`outline-none flex gap-3 items-center w-full py-2 px-3 rounded-lg transition-all duration-200
                ${openSubmenu?.type === menuType && openSubmenu?.index === index ? "font-semibold" : ""}
                ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className="menu-item-icon-size flex-shrink-0">
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text flex-1 text-left">
                  {nav.name}
                </span>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`outline-none flex gap-3 items-center py-2 px-3 rounded-lg transition-all duration-200
                  ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
              >
                <span className="menu-item-icon-size flex-shrink-0">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text flex-1 text-left">
                    {nav.name}
                  </span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out bg-white border-r border-gray-200 shadow-md flex flex-col
          ${isExpanded || isMobileOpen ? "w-[220px]" : isHovered ? "w-[220px]" : "w-[80px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
        onMouseEnter={() => !isExpanded && setIsHovered(false)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className={`flex items-center h-19 px-1.5 gap-4 border-b border-gray-300 ${
            !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 outline-none">
            {isExpanded || isHovered || isMobileOpen ? (
              <div className="pl-12">
                <p className="text-3xl font-bold text-indigo-600">Inkspire</p>
              </div>
            ) : (
              <span className="text-white py-1.5 px-3 rounded-md bg-indigo-600 font-bold text-2xl">
                IS
              </span>
            )}
          </Link>

          {isExpanded ||
            (isMobileOpen && (
              <p
                className="cursor-pointer lg:hidden bg-gray-200 p-1 hover:bg-gray-300 rounded-full"
                onClick={toggleMobileSidebar}
                aria-label="Close sidebar"
              >
                <X size={24} />
              </p>
            ))}
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {renderMenuItems(navItems, "main")}

          <SidebarFollowing />
        </nav>

        {/* <SidebarFollowing /> */}
      </aside>
    </>
  );
};

export default Sidebar;
