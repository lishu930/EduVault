import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../public/logo.webp'
import axios from 'axios'
import toast from 'react-hot-toast';

export default function Dashboard() {


    const handleLogout = async () => {
        try {
            const response = await axios.get("http://localhost:4001/api/v1/user/logout", {
                withCredentials: true,
            });

            toast.success(response.data.message);

            // Clear admin data from localStorage
            localStorage.removeItem("admin");
            localStorage.removeItem("adminId"); // if you store ID separately
            localStorage.removeItem("adminToken"); // if you store token separately

            setIsLoggedIn(false);
            setAdminData(null);
        } catch (error) {
            console.log("Error in logging out:", error);
            toast.error(error.response?.data?.errors || "Error in logging out");
        }
    };

    const [isLoggedIn, setIsLoggedIn] = React.useState(!!localStorage.getItem("admin"));
    const [adminData, setAdminData] = React.useState(null);

    const deleteAdmin = async () => {
        try {
            const adminId = adminData?._id || localStorage.getItem("adminId");
            if (!adminId) {
                toast.error("Admin ID not found");
                return;
            }
            const token = localStorage.getItem("adminToken");
            const response = await axios.delete(
                `http://localhost:4001/api/v1/admin/delete/${adminId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            toast.success(response.data.message);
            localStorage.removeItem("admin");
            setIsLoggedIn(false);
        } catch (error) {
            console.log("Error deleting admin:", error);
            toast.error(error.response?.data?.errors || "Error deleting admin");
        }
    };

    React.useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const storedAdmin = localStorage.getItem("admin");
                const parsedAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;
                const adminId = parsedAdmin?._id || localStorage.getItem("adminId");

                if (!adminId) {
                    console.warn("No adminId found in localStorage");
                    return;
                }

                const response = await axios.get(
                    `http://localhost:4001/api/v1/admin/getadmin/${adminId}`,
                    { withCredentials: true }
                );

                setAdminData(response.data.data); // backend sends { success, data: admin }
                localStorage.setItem("admin", JSON.stringify(response.data.data));
            } catch (error) {
                console.log("Error fetching admin data:", error);
            }
        };

        if (isLoggedIn) {
            fetchAdminData();
        }
    }, [isLoggedIn]);
    return (

        <div className="flex flex-col md:flex-row min-h-screen">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-gray-100 p-5">
                <div className="flex items-center flex-col mb-10">
                    <img src={logo} alt="Profile" className="rounded-full h-20 w-20" />
                    <h2 className="text-lg font-semibold mt-4">I'm Admin</h2>
                </div>
                <nav className="flex flex-col space-y-4">
                    <Link to="/admin/our-courses">
                        <button className="w-full bg-green-700 hover:bg-green-600 text-white py-2 rounded">
                            Our Courses
                        </button>
                    </Link>
                    <Link to="/admin/create-course">
                        <button className="w-full bg-orange-500 hover:bg-orange-400 text-white py-2 rounded">
                            Create Course
                        </button>
                    </Link>
                    <Link to="/admin/login">
                        <button
                            onClick={deleteAdmin}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
                        >
                            Delete Account
                        </button>
                    </Link>
                    <Link to="/admin/login">
                        <button
                            onClick={handleLogout}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded"
                        >
                            Logout
                        </button>
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex flex-col flex-1 items-center justify-center p-6 text-center">
                <h1 className="text-2xl md:text-4xl font-bold">
                    Welcome to Admin Dashboard
                </h1>
                <h2 className="text-lg md:text-2xl font-semibold mt-4">
                    Hello, {adminData?.firstname + " " + adminData?.lastname || "Admin"}
                </h2>
                <h5 className="text-sm md:text-md mt-2">
                    Email: {adminData?.email || "N/A"}
                </h5>
                
            </div>
        </div>
    )
}

