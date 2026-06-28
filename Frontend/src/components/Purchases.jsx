
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { RiHome2Fill } from 'react-icons/ri';
import { FaDiscord } from 'react-icons/fa6';
import { FaDownload } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { IoLogIn, IoLogOut } from "react-icons/io5";
import syllabus from '../assets/Syllabus-BCA Core Course-CC1-CC14.pdf';

export default function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  console.log("purchases ", purchases);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [])




  //     useEffect(() => {
  //       const userData=localStorage.getItem("user");
  //        const user =userData ? JSON.parse(userData):null;
  //        const token=user?.token;
  //          const fetchPurchases = async () => {
  //   // console.log("User from localStorage:", user);
  //   // console.log("Token:", token);
  //   if (!token) {
  //     setErrorMessage("Please login to purchase the courses");
  //     return;
  //   }
  //   try {
  //     // setLoading(true);
  //     const response = await axios.get(
  //       `http://localhost:4001/api/v1/user/purchased`,
  //       {}, {
  //       headers: {
  //         Authorization: `Bearer ${token}`
  //       },
  //       withCredentials: true,

  //     })
  //     setPurchases(response.data.courseData)
  //   } catch (error) {
  //     setErrorMessage(error.response.data.errors || "Failed to fetch purchase data ")
  //   }
  // };
  // fetchPurchases()
  //         },

  //      []);


  useEffect(() => {
    const userData = localStorage.getItem("user");
    const user = userData ? JSON.parse(userData) : null;
    const token = user?.token;

    const fetchPurchases = async () => {
      if (!token) {
        setErrorMessage("Please login to view your purchases");
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:4001/api/v1/user/purchased",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setPurchases(response.data.courseData || []);
      } catch (error) {
        setErrorMessage(error.response?.data?.errors || "Failed to fetch purchase data");
      }
    };

    fetchPurchases();
  }, []);
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 p-5 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } md:relative md:translate-x-0 md:block`}
      >
        <nav>
          <ul>
            <li className="mb-4">
              <Link
                to="/"
                className="flex items-center hover:text-blue-400"
                onClick={() => setIsSidebarOpen(false)}
              >
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/courses"
                className="flex items-center hover:text-blue-400"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaDiscord className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <a
                href="#"
                className="flex items-center text-blue-500 hover:text-blue-400"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaDownload className="mr-2" /> Purchases
              </a>
            </li>
            <li className="mb-4">
              <a
                href={syllabus}
                className="flex items-center  hover:text-blue-400"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaDownload className="mr-2" /> Syllabus
              </a>
            </li>
            <li className="mb-4">
              <Link to="/profile" className="flex items-center hover:text-blue-400">
                <FaDiscord className="mr-2" /> Profile
              </Link>
            </li>
            <li className="mb-4">
              <Link
                to="/setting"
                className="flex items-center hover:text-blue-400"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaDiscord className="mr-2" /> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-10">
        <button
          className="mb-4 px-4 py-2 text-sm font-semibold bg-blue-500 rounded md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          Menu
        </button>
        <h2 className="text-2xl font-semibold mb-6">My Purchases</h2>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* Purchases */}
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 ml-0">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-gray-700 rounded-lg shadow-lg p-6 flex flex-col space-y-4 hover:scale-105 transition-transform"
              >
                {/* Course Image */}
                <img
                  className="rounded-lg object-cover w-full h-40"
                  src={purchase.image?.url || "https://via.placeholder.com/200"}
                  alt={purchase.title}
                />

                {/* Course Info */}
                <div className="text-center">
                  <h3 className="text-lg font-bold">{purchase.title}</h3>
                  <p className="text-gray-300 text-sm mt-2">
                    {purchase.description.length > 100
                      ? `${purchase.description.slice(0, 100)}...`
                      : purchase.description}
                  </p>
                  <span className="text-green-400 font-semibold block mt-2">
                    ${purchase.price} only
                  </span>
                </div>


                <div className="flex flex-wrap gap-3 mt-4">
                  <button
                    onClick={() => {
                      const viewerUrl = `https://docs.google.com/viewer?url=${purchase.pyqs?.url}&embedded=true`;
                      window.open(viewerUrl, "_blank");
                    }}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  >
                    Open PYQs
                  </button>

                  <button
                    onClick={() => {
                      const viewerUrl = `https://docs.google.com/viewer?url=${purchase.notes?.url}&embedded=true`;
                      window.open(viewerUrl, "_blank");
                    }}
                    className="bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                  >
                    Open Notes
                  </button>
                  <button
                    onClick={() => {
                      const viewerUrl = `https://docs.google.com/viewer?url=${purchase.practice?.url}&embedded=true`;
                      window.open(viewerUrl, "_blank");
                    }}
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Open Practice
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You have no purchases yet.</p>
        )}
      </div>
    </div>
  )
}



