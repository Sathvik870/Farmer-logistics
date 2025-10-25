import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import userAvatar from "../assets/admin-user.svg";
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineBriefcase,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineShoppingBag,
} from "react-icons/hi";

interface SidebarProps {
  isOpen: boolean;
}

const mainLinks = [
  { name: "Dashboard", path: "/dashboard", icon: HiOutlineHome },
  { name: "Products", path: "/products", icon: HiOutlineShoppingBag },
  {
    name: "Purchase orders",
    path: "/purchase-orders",
    icon: HiOutlineCalendar,
  },
  { name: "Sales orders", path: "/sales-orders", icon: HiOutlineBriefcase },
  { name: "Customers", path: "/customers", icon: HiOutlineUsers },
];

const secondaryLinks = [
  { name: "Settings", path: "/settings", icon: HiOutlineCog },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <aside
      className={`bg-[#f7f7f7] text-black flex flex-col h-full transition-all duration-300 ease-in-out shadow-lg
        ${isOpen ? "w-64" : "w-20"}`}
    >
      <div className="flex items-center h-20 border-b-2 border-[#144a31]  px-6 flex-shrink-0">
        <img src="/logo.svg" alt="Company Logo" className="h-8 w-8" />
        <span
          className={`ml-3 text-xl font-bold whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        >
          Farmer Logistics
        </span>
      </div>

      <nav className="flex-grow px-4 py-6 space-y-2">
        {mainLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `relative  text-base flex items-center p-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-[#144a3110] text-[#144a31] font-semibold"
                  : "hover:bg-[#387c40] hover:text-[#f7f7f7]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`absolute left-0 h-6 w-1 rounded-r-full bg-[#144a31] transition-opacity ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                ></span>
                <link.icon className="h-6 w-6 flex-shrink-0" />
                <span
                  className={`ml-4 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {link.name}
                </span>
              </>
            )}
          </NavLink>
        ))}

        <div className="pt-6 mt-6 border-t border-gray-300 space-y-2">
          {secondaryLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) =>
                `relative text-base flex items-center p-3 rounded-lg transition-colors duration-200  ${
                  isActive
                    ? "bg-[#144a3110] text-[#144a31] font-semibold"
                    : "hover:bg-[#387c40] hover:text-[#f7f7f7]"
                }`
              }
            >
              <link.icon className="h-6 w-6 flex-shrink-0" />
              <span
                className={`ml-4 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                  isOpen ? "opacity-100" : "opacity-0"
                }`}
              >
                {link.name}
              </span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="flex-shrink-0 p-4 border-t border-gray-200">
        <div className="flex items-center">
          <img
            src={userAvatar}
            alt="User Avatar"
            className="w-8 h-8 rounded-full"
          />
          <div
            className={`ml-3 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <p className="font-semibold text-lg">
              {user?.first_name || "User"}
            </p>
            <p className="text-medium text-gray-500">
              {user?.role || "Designation"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className={`ml-auto p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-opacity duration-200 ${
              isOpen ? "opacity-100" : "opacity-0"
            }`}
          >
            <HiOutlineLogout className="h-6 w-6" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
