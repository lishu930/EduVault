import React, { useEffect, useState } from "react";
import axios from "axios"; // for backend requests
import { useNavigate } from "react-router-dom";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch profile data from backend
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleUpdate = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put(`http://localhost:4001/api/v1/user/edit-profile`, {
        firstname: user.firstname,
        lastname: user.lastname,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Updated user:", res.data);
        alert("Profile updated successfully!");
        navigate("/");
      })
      .catch((err) => {
        console.error("Error updating profile:", err);
        alert("Failed to update profile.");
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-gray-700 dark:text-gray-300">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
          👤 My Profile
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={user.firstname || ""}
              onChange={(e) => setUser({ ...user, firstname: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Last Name
            </label>
            <input
              type="text"
              value={user.lastname || ""}
              onChange={(e) => setUser({ ...user, lastname: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100 
                         focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>



          <button
            type="submit"
            className="w-full px-4 py-3 rounded-lg bg-blue-500 text-white font-medium 
                       hover:bg-blue-600 transition-colors"
          >
            💾 Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;