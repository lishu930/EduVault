import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../public/logo.webp'
import axios from 'axios';
import toast from 'react-hot-toast';


export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("Form submitted:", { firstname, lastname, email, password });
    // Here you can add your form submission logic, such as sending the data to a server or performing validation.
    try {
      const response = await axios.post("http://localhost:4001/api/v1/admin/login", {
        email,
        password,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      // console.log("Login successful", response.data.admin);

      console.log("admin: ", response.data.admin);
      toast.success("Login successful!");
      navigate("/admin/dashboard");
      // toast.success(response.data.message);
      // localStorage.setItem("admin", JSON.stringify(response.data));
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem("admin", JSON.stringify(response.data.admin));
      // localStorage.setItem("adminId", response.data.admin._id);

      // After successful admin login

      // In AdminLogin.jsx after successful login
      const { admin, token } = response.data;

      localStorage.setItem("admin", JSON.stringify({ ...admin, token }));
      // localStorage.setItem("admin", JSON.stringify({
      //   _id: response.data.admin._id,
      //   token: response.data.token
      // }));
      setisLoggedIn(true);
    } catch (error) {
      if (error.response) {
        //alert(error.response.data.errors);
        setErrorMessage(error.response.data.errors || "Login failed");

      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 flex flex-col items-center justify-center px-4">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-gray-900 bg-opacity-90 flex justify-between items-center px-6 py-4 shadow-md z-50">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="Logo" className="w-12 h-12 rounded-full" />
          <Link to="/" className="text-2xl font-bold text-orange-500">EduVault</Link>
        </div>
        <div className="hidden md:flex items-center space-x-3">
          <Link to="/admin/signup" className="border border-gray-500 text-gray-300 py-2 px-4 rounded-md hover:bg-gray-700 transition">Sign Up</Link>
          <Link to="/courses" className="bg-orange-500 py-2 px-4 rounded-md text-white hover:bg-orange-600 transition">Join Now</Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button className="text-gray-300 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute top-16 left-0 w-full bg-gray-800 flex flex-col items-center space-y-4 py-4 md:hidden">
              <Link to="/admin/signup" className="text-gray-300 hover:text-orange-500">Sign Up</Link>
              <Link to="/courses" className="text-white bg-orange-500 px-4 py-2 rounded-md hover:bg-orange-600">Join Now</Link>
            </div>
          )}

        </div>
      </header>

      {/* Login Card */}
      <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 w-full max-w-md mt-28 mb-10 p-8 rounded-xl shadow-2xl">
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg text-white">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Welcome to <span className="text-orange-500">EduVault</span>
          </h2>
          <p className="text-center text-gray-400 mb-6">
            Log in to access admin dashboard!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-gray-400 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Type your email"
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-gray-400 mb-1">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Type your password"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="text-red-500 text-center">{errorMessage}</div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 py-3 rounded-md text-white font-semibold hover:bg-purple-600 transition duration-300"
            >
              Log In
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-400 text-sm mb-6">
        © 2026 EduVault. All rights reserved.
      </footer>
    </div>
  );

}

// export default Login
