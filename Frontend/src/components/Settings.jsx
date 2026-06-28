import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = axios.get("http://localhost:4001/api/v1/user/logout", {
        withCredentials: true,
      })
      toast.success((await response).data.message);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.log("Error in logging out:", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  }

//   const deleteProfile = async () => {
//   try {
//     const response = await axios.delete(
//       `http://localhost:4001/api/v1/user/delete-profile/${userId}`
//     );

//     // ✅ Always check response before accessing .data
//     if (response && response.data) {
//       console.log("Profile deleted:", response.data);
//       // handle success (navigate, show toast, etc.)
//     } else {
//       console.error("Unexpected response:", response);
//     }
//   } catch (error) {
//     console.error("Error deleting profile:", error);
//     // handle error (show message to user)
//   }
// };

const deleteProfile = async () => {
  try {
    const token = localStorage.getItem("token"); // or "userToken" depending on your app

    if (!token) {
      console.error("No token found in localStorage");
      return;
    }
    const response = await axios.delete(
      "http://localhost:4001/api/v1/user/delete-profile", // no :id in URL
      {
        headers: {
          Authorization: `Bearer ${token}`, // send JWT token
        },
      }
    );

    if (response && response.data) {
      console.log("Profile deleted:", response.data);
      // handle success (navigate, toast, etc.)
      toast.success(response.data.message || "Profile deleted successfully");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login"); // or wherever you want to redirect after deletion
    } else {
      console.error("Unexpected response:", response);
    }
  } catch (error) {
    console.error("Error deleting profile:", error);
    toast.error("Failed to delete profile. Please try again.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100 flex items-center">
          ⚙️ Settings
        </h2>

        <div className="space-y-4">
          <button
            className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
            onClick={() => navigate('/edit-profile')}
          >
            ✏️ Edit Profile
          </button>
        </div>

          <div className="space-y-4 pt-4">
            <button
              className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors"
              onClick={deleteProfile}
            >
              🗑️ Delete Profile
            </button>

            <button
              className="w-full px-4 py-3 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
              onClick={handleLogout}
              to={'/login'}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
      );
}
export default Settings;