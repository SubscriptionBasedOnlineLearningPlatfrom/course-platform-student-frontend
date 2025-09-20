import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '@/assets/logo.jpeg'; // Adjust the path to your logo image
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-md">
      <div className="max-w-15xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-25 items-center">
          
          {/* Logo and Name */}
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-18 w-18 mr-3 rounded-full border border-gray-300"
            />
            <span
                className="hidden lg:inline-block text-4xl font-extrabold"
                style={{ fontFamily: "'Montserrat', sans-serif", color: "#615f5fff" }} 
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
            <Link
              to="/login"
              className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
            >
              Login
            </Link>
            {/* <Link
              to="/signup"
              className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
            >
              Sign Up
            </Link> */}
            <Link
              to="/dashboard"
              className="hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
            >
              Dashboard
            </Link>
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
          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setIsOpen(false)}
            className="block hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition duration-200"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
