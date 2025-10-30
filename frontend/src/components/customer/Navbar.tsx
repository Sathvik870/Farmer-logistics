import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useCustomerAuth } from "../../context/customer/auth/useCustomerAuth";
import {
  HiOutlineSearch,
  HiOutlineLocationMarker,
  HiOutlineUserCircle,
  HiOutlineShoppingCart,
  HiChevronDown,
} from "react-icons/hi";
import { GiFruitBowl, GiMilkCarton } from "react-icons/gi";
import { LuCarrot } from "react-icons/lu";
import { IoBagHandleOutline } from "react-icons/io5";
import { useCart } from "../../context/customer/cart/useCart.ts";

const categories = [
  { name: "All", href: "/", icon: <IoBagHandleOutline size={20} /> },
  { name: "Fruits", href: "/category/fruits", icon: <GiFruitBowl size={20} /> },
  {
    name: "Vegetables",
    href: "/category/vegetables",
    icon: <LuCarrot size={20} />,
  },
  { name: "Dairy", href: "/category/dairy", icon: <GiMilkCarton size={20} /> },
];

const Navbar: React.FC = () => {
  const { isAuthenticated, customer } = useCustomerAuth();
  const { cartCount } = useCart();
  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 md:gap-8">
          <div className="flex items-center gap-4 shrink-0">
            <Link to="/" className="text-2xl font-bold text-[#387c40]">
              Farmer Logistics
            </Link>
            <button className="hidden md:flex items-center gap-2 text-sm text-gray-700 font-semibold border-l pl-4">
              <HiOutlineLocationMarker className="text-gray-500" />
              Select Location
              <HiChevronDown />
            </button>
          </div>
          <div className="flex-1 max-w-2xl relative">
            <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder='Search for "cheese slices"'
              className="w-full h-12 pl-12 pr-4 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-[#387c40]"
            />
          </div>

          <div className="flex items-center gap-6">
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="flex flex-col items-center text-sm font-medium text-gray-700 hover:text-[#387c40]"
            >
              <HiOutlineUserCircle size={24} />
              <span>
                {isAuthenticated && customer ? customer.first_name : "Login"}
              </span>
            </Link>
            <Link
              to="/cart"
              className="relative flex flex-col items-center text-sm font-medium text-gray-700 hover:text-[#387c40]"
            >
              <HiOutlineShoppingCart size={24} />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#387c40] text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <nav className="container mx-auto px-4 flex items-center gap-6 overflow-x-auto py-2">
          {categories.map((category) => (
            <NavLink
              key={category.name}
              to={category.href}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-purple-100 text-[#387c40]"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {category.icon}
              {category.name}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
