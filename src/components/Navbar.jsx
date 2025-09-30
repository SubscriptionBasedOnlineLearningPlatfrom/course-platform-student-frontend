import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import logo from "@/assets/logo.jpeg"; // Adjust the path to your logo image
import { FaBars, FaTimes } from "react-icons/fa";
import { useApi } from "@/contexts/ApiContext";
import { FaUserEdit } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToken, setIsToken] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const { BackendAPI } = useApi();
  const profileRef = useRef(null);

  useEffect(() => {
    try {
      const fetchProfile = async () => {
        const studentToken = localStorage.getItem("studentToken");

        if (studentToken) {
          setIsToken(true);
        }

        const response = await axios.get(`${BackendAPI}/profile`, {
          headers: {
            Authorization: `Bearer ${studentToken}`,
          },
        });

        if (response.status === 200) {
          setUser(response.data);
        }
      };

      fetchProfile();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b shadow-md">
      <div className="max-w-15xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-25 items-center">
          {/* Logo and Name */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-15 w-15 mr-3 rounded-full border border-gray-300"
            />
            <span
              className="hidden lg:inline-block text-4xl font-extrabold"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                color: "#615f5fff",
              }}
            >
              ProLearnX
            </span>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 text-xl font-semibold text-gray-700">
            <Link
              to="/"
              className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/courses"
              className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
            >
              Courses
            </Link>

            {!isToken ? (
              <Link
                to="/auth"
                className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
              >
                Login
              </Link>
            ) : (
              <div ref={profileRef} className="relative">
                <div
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="cursor-pointer"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold border-2 border-gray-300">
                      {user?.username?.[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-800 focus:outline-none text-2xl"
            >
              {isOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 text-xl font-semibold text-gray-700">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
          >
            Home
          </Link>
          <Link
            to="/courses"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
          >
            Courses
          </Link>
          {!isToken ? (
            <Link
              to="/auth"
              className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <div
                ref={profileRef}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="cursor-pointer"
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold border-2 border-gray-300">
                    {user?.username?.[0].toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Profile Sidebar */}
      {isProfileOpen && (
        <div ref={profileRef} className="absolute right-0 top-25 w-72 bg-white shadow-xl border rounded-lg p-5 z-50">
          {/* Profile Info */}
          <div className="flex flex-col items-center mb-6">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.username}
                className="w-20 h-20 rounded-full border-2 border-gray-300 object-cover mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold border-2 border-gray-300 mb-3 text-2xl">
                {user?.username?.[0].toUpperCase()}
              </div>
            )}
            <h3 className="text-xl font-semibold">{user.username}</h3>
            <p className="text-gray-500 text-sm">Student</p>
          </div>

          {/* Menu Options */}
          <ul className="space-y-4 text-gray-700">
            <li>
              <Link
                to="/profile/edit"
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition duration-200"
              >
                <FaUserEdit className="w-5 h-5" />
                Edit Profile
              </Link>
            </li>
            <li>
              <Link
                to="/subscription/view"
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition duration-200"
              >
                <MdPayment className="w-5 h-5" />
                View Subscription Plan
              </Link>
            </li>
            <li>
              <Link
                to="/subscription/change"
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-blue-50 hover:text-blue-600 transition duration-200"
              >
                <FaExchangeAlt className="w-5 h-5" />
                Change Subscription Plan
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("studentToken");
                  setIsToken(false);
                  setUser(null);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded hover:bg-red-50 hover:text-red-600 transition duration-200 w-full text-left"
              >
                <HiOutlineLogout className="w-5 h-5" />
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
