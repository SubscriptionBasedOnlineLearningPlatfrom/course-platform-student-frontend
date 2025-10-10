import React, { useEffect, useRef, useState } from "react";
import { Link, Router, useNavigate } from "react-router-dom";
import axios from "axios";
import logo from "@/assets/logo.jpeg"; // Adjust the path to your logo image
import { FaBars, FaTimes } from "react-icons/fa";
import { useApi } from "@/contexts/ApiContext";
import { FaUserEdit } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { BiSolidDashboard } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { Button } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";
import { BsPencilSquare } from "react-icons/bs";
import { toast } from "react-toastify";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isToken, setIsToken] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState(null);
  const [isSubscriptionPlanOpen, setIsSubscriptionPlanOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const { BackendAPI } = useApi();
  const navigate = useNavigate();
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

  const handleViewSubscription = async () => {
    try {
      const studentToken = localStorage.getItem("studentToken");
      const response = await axios.get(`${BackendAPI}/subscription/check`, {
        headers: {
          Authorization: `Bearer ${studentToken}`,
        },
      });

      if (response.status === 200) {
        setSubscriptionPlan(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleActiveCurrentPlan = async (payment_id) => {
    try {
      const studentToken = localStorage.getItem("studentToken");
      const response = await axios.post(
        `${BackendAPI}/subscription/active-plan/${payment_id}`,
        { plan: subscriptionPlan?.payment?.plan },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${studentToken}`,
          },
        }
      );
      if (response.status === 200) {
        toast.success("Subscription activated successfully");
        window.location.href = response.data.session_url;
      }
    } catch (error) {
      toast.error("Failed to activate subscription ");
      console.error(error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.warn("Please select a file first ⚠️");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const studentToken = localStorage.getItem("studentToken");
      const response = await axios.post(
        `${BackendAPI}/profile/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${studentToken}`,
          },
        }
      );
      console.log(response)
      if (response.status === 200) {
        // Update the user state directly
        setUser((prevUser) => ({
          ...prevUser,
          user_profile: response.data.profile.user_profile, // set new image URL
        }));
        toast.success("Profile picture uploaded successfully");
        setFile(null); // Clear selected file
      }
    } catch (error) {
      toast.error("Upload failed! Please try again.");
      console.error(error);
    }
  };

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
                  {user?.user_profile ? (
                    <img
                      src={user.user_profile}
                      alt={user.username}
                      className="w-10 h-10 rounded-full border-2 border-[#0173d1] object-cover"
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
                {user?.user_profile ? (
                  <img
                    src={user.user_profile}
                    alt={user.username}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold border-2 border-[#0173d1]">
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
        <div
          ref={profileRef}
          className="absolute right-0 top-24 w-80 bg-white shadow-xl border rounded-lg p-4 z-50"
        >
          {/* Profile Info */}
          <div className="flex flex-col items-center mb-6 p-4 bg-white rounded-2xl shadow-md w-full">
            <div className="relative w-28 h-28 mb-4">
              {user?.user_profile ? (
                <img
                  src={user.user_profile}
                  alt={user.username}
                  className="w-full h-full rounded-full border-4 bg-[#0173d1] border-[#0173d1] object-cover shadow-sm"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-[#0173d1] text-white flex items-center justify-center font-bold text-3xl border-4 border-[#0173d1] shadow-sm">
                  {user?.username?.[0]?.toUpperCase()}
                </div>
              )}

              {/* Overlay edit button */}
              <label
                htmlFor="fileInput"
                className="absolute bottom-0 right-0 bg-[#0173d1] text-white p-1 rounded-full cursor-pointer shadow-lg transition"
              >
                <BsPencilSquare />
              </label>
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <button
              onClick={handleUpload}
              className="w-full py-2 px-4 bg-gradient-to-r from-[#0173d1] to-[#85c1f3] text-white font-semibold rounded-lg shadow-md transition mb-2"
            >
              Upload
            </button>

            <h3 className="text-xl font-semibold">{user?.username}</h3>
            <p className="text-gray-500 text-sm">Student</p>
          </div>

          {/* Menu Options */}
          <ul className="space-y-4 text-gray-700">
            {/* Subscription Plan */}
            <li>
              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate("/dashboard");
                }}
                className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition font-medium"
              >
                <div className="flex items-center gap-2">
                  <BiSolidDashboard className="w-5 h-5" />
                  <span>Go to Dashboard</span>
                </div>
              </button>
              <button
                onClick={() => {
                  handleViewSubscription();
                  setIsSubscriptionPlanOpen(!isSubscriptionPlanOpen);
                }}
                className="flex items-center justify-between w-full px-4 py-2 rounded-md hover:bg-blue-50 hover:text-blue-600 transition font-medium"
              >
                <div className="flex items-center gap-2">
                  <MdPayment className="w-5 h-5" />
                  <span>View Subscription Plan</span>
                </div>
                <span className="text-gray-500">
                  {isSubscriptionPlanOpen ? "▲" : "▼"}
                </span>
              </button>

              {isSubscriptionPlanOpen && (
                <div className="mt-2 bg-white border border-gray-200 shadow-sm rounded-md p-4 text-gray-700 space-y-2 animate-slideDown">
                  <div className="flex justify-between">
                    <span className="font-semibold">Active:</span>
                    <span>{subscriptionPlan?.is_active ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Expiry Date:</span>
                    <span>
                      {subscriptionPlan?.expiry_at
                        ? new Date(
                            subscriptionPlan.expiry_at
                          ).toLocaleDateString("en-CA")
                        : "Not Available"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Plan:</span>
                    <span>
                      {subscriptionPlan?.payment?.plan || "Not Subscribed"}
                    </span>
                  </div>
                  <div className="mt-4 flex justify-center">
                    {!subscriptionPlan?.is_active && (
                      <button
                        onClick={() =>
                          handleActiveCurrentPlan(
                            subscriptionPlan?.payment?.payment_id
                          )
                        }
                        className="px-6 py-2 bg-gradient-to-r from-[#0173d1] to-[#85c1f3] text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                      >
                        Activate Current Plan
                      </button>
                    )}
                  </div>
                </div>
              )}
            </li>

            {/* Change Plan */}
            <li>
              <button
                onClick={() => {
                  setIsSubscriptionPlanOpen(false);
                  navigate("/subscription/change");
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#0173d1] to-[#85c1f3] text-white rounded-lg shadow hover:from-blue-600 hover:to-indigo-700 transition"
              >
                Change Plan
              </button>

              <p className="mt-2 text-xs text-gray-500 italic flex items-start gap-2">
                <FiAlertTriangle className="text-red-600 text-lg mt-0.5" />
                <span>
                  You can change your subscription plan. The new plan will take
                  effect after the current plan expires.
                </span>
              </p>
            </li>

            {/* Logout */}
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("studentToken");
                  setIsToken(false);
                  setUser(null);
                  navigate("/auth", { replace: true });
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
