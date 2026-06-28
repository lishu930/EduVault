import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCircleUser, FaDiscord } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import logo from '../../public/logo.webp';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import syllabus from '../assets/Syllabus-BCA Core Course-CC1-CC14.pdf';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:4001/api/v1/course/getcourses", {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="flex min-h-screen">
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
                className="flex items-center hover:text-blue-400 text-blue-500"
                onClick={() => setIsSidebarOpen(false)}
              >
                <FaDiscord className="mr-2" /> Courses
              </Link>
            </li>
            <li className="mb-4">
              <a
                href="/purchases"
                className="flex items-center  hover:text-blue-400"
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
      <main className="flex-1 bg-gray-900 p-6">
        <div className="flex-1 p-6 md:ml-10">
          <button
            className="mb-4 px-4 py-2 text-sm font-semibold bg-blue-500 rounded md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            Menu
          </button>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}
        <h2 className="text-2xl font-semibold text-white mb-6">Courses</h2>

        {/* Courses grid */}
        <div className="overflow-y-auto max-h-[75vh]">
          {loading ? (
            <p className="text-center text-gray-500">Loading...</p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">No courses posted yet by admin</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="border border-gray-300 rounded-lg p-4 shadow-sm bg-gray-800"
                >
                  <img
                    src={course.image?.url}
                    alt={course.title}
                    className="rounded mb-4 w-full h-40 object-cover"
                  />
                  <h2 className="text-lg font-bold mb-2">{course.title}</h2>
                  <p className="text-gray-400 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-xl">
                      ₹{course.price}{" "}
                      <span className="text-gray-500 line-through">500</span>
                    </span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <Link
                    to={`/buy/${course._id}`}
                    className="bg-orange-400 w-full text-white px-4 py-2 rounded-lg hover:bg-blue-400 duration-300 text-center block"
                  >
                    Enroll Now
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>

  );
}