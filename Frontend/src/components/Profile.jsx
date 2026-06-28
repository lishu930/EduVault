import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscord, FaDownload } from "react-icons/fa";
import axios from "axios";
import profilePic from "../../public/default.webp";
import syllabus from "../assets/Syllabus-BCA Core Course-CC1-CC14.pdf";

function Profile() {
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Load user from localStorage if available
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Always refresh from backend
    axios
      .get("http://localhost:4001/api/v1/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.success && res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        } else {
          navigate("/login");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to fetch profile:", err);
        navigate("/login");
      });
  }, [navigate]);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <h4 className="text-gray-700 dark:text-gray-300">Loading profile...</h4>
      </div>
    );
  }

  // return (
  //   <div className="flex">
  //     {/* Sidebar overlay for mobile */}
  //     {isSidebarOpen && (
  //       <div
  //         className="fixed inset-0 z-30 bg-black/50 md:hidden"
  //         onClick={() => setIsSidebarOpen(false)}
  //       />
  //     )}

  //     {/* Sidebar */}
  //     <div
  //       className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 p-5 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  //         } md:relative md:translate-x-0 md:block`}
  //     >
  //       <nav>
  //         <ul>
  //           <li className="mb-4">
  //             <Link to="/" className="flex items-center hover:text-blue-400">
  //               <RiHome2Fill className="mr-2" /> Home
  //             </Link>
  //           </li>
  //           <li className="mb-4">
  //             <Link to="/courses" className="flex items-center hover:text-blue-400">
  //               <FaDiscord className="mr-2" /> Courses
  //             </Link>
  //           </li>
  //           <li className="mb-4">
  //             <Link to="/purchases" className="flex items-center hover:text-blue-400">
  //               <FaDownload className="mr-2" /> Purchases
  //             </Link>
  //           </li>
  //           <li className="mb-4">
  //             <a
  //               href={syllabus}
  //               className="flex items-center  hover:text-blue-400"
  //               onClick={() => setIsSidebarOpen(false)}
  //             >
  //               <FaDownload className="mr-2" /> Syllabus
  //             </a>
  //           </li>
  //           <li className="mb-4">
  //             <Link to="/profile" className="flex items-center hover:text-blue-400 text-blue-500">
  //               <FaDiscord className="mr-2" /> Profile
  //             </Link>
  //           </li>
  //           <li className="mb-4">
  //             <Link to="/setting" className="flex items-center hover:text-blue-400">
  //               <FaDiscord className="mr-2" /> Settings
  //             </Link>
  //           </li>
  //         </ul>
  //       </nav>
  //     </div>

  //     {/* Main content */}
  //     <div className="flex-1">
  //       <div className="flex-1 p-6 md:ml-10">
  //         <button
  //           className="mb-4 px-4 py-2 text-sm font-semibold bg-blue-500 rounded md:hidden"
  //           onClick={() => setIsSidebarOpen(true)}
  //         >
  //           Menu
  //         </button>
  //       </div>
  //       {/* <Navbar1 /> */}
  //       <div className="container mx-auto mt-4 p-4">
  //         {/* Profile Header */}
  //         <div className="flex items-center mb-4">
  //           <img
  //             src={profilePic}
  //             alt="Profile"
  //             className="rounded-full mr-4"
  //             style={{ width: "120px", height: "120px", objectFit: "cover" }}
  //           />
  //           <div>
  //             <h3 className="text-xl font-bold">
  //               {user.firstname} {user.lastname}
  //             </h3>
  //             <p className="text-gray-500">{user.email}</p>
  //           </div>
  //         </div>

  //         {/* Go to Homepage Button */}
  //         <div className="mb-4">
  //           <button
  //             className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
  //             onClick={() => navigate("/")}
  //           >
  //             Go to Homepage
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white p-5 transform transition-transform duration-200 ease-in-out 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
      >
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav>
          <ul className="space-y-4">
            <li>
              <Link to="/" className="flex items-center hover:text-blue-400">
                <RiHome2Fill className="mr-2" /> Home
              </Link>
            </li>
            <li>
              <Link to="/courses" className="flex items-center hover:text-blue-400">
                <FaDiscord className="mr-2" /> Courses
              </Link>
            </li>
            <li>
              <Link to="/purchases" className="flex items-center hover:text-blue-400">
                <FaDownload className="mr-2" /> Purchases
              </Link>
            </li>
            <li>
              <Link to="/profile" className="flex items-center hover:text-blue-400 text-blue-500">
                <FaDiscord className="mr-2" /> Profile
              </Link>
            </li>
            <li>
              <Link to="/setting" className="flex items-center hover:text-blue-400">
                <FaDiscord className="mr-2" /> Settings
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 md:ml-64">
        {/* Mobile menu button */}
        <button
          className="mb-4 px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded md:hidden"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰ Menu
        </button>

        {/* Profile Card */}
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <img
              src={profilePic}
              alt="Profile"
              className="rounded-full mr-4 border-4 border-blue-500"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
            <div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {user.firstname} {user.lastname}
              </h3>
              <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>

          <button
            className="w-full px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
            onClick={() => navigate("/")}
          >
            Go to Homepage
          </button>
        </div>
      </main>
    </div>
  );
}


export default Profile;
