import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Courses from './components/Courses';
import Buy from './components/Buy';
import Purchases from './components/Purchases';
import { Toaster } from 'react-hot-toast';
import AdminSignup from './admin/AdminSignup';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';
import CourseCreate from './admin/CourseCreate';
import UpdateCourse from './admin/UpdateCourse';
import OurCourses from './admin/OurCourses';
import Settings from './components/Settings';
import Profile from './components/Profile';
import UpdateProfile from './components/Update-Profile';

function App() {
  // const admin = JSON.parse(localStorage.getItem("admin"));
  // const user = JSON.parse(localStorage.getItem("user"));
  // const storedAdmin = localStorage.getItem("admin");
  // const admin = storedAdmin ? JSON.parse(storedAdmin) : null;

  const storedAdmin = localStorage.getItem("admin");
const admin = storedAdmin ? JSON.parse(storedAdmin) : null;

const storedUser = localStorage.getItem("token") ? localStorage.getItem("user") : null;
const user = storedUser ? JSON.parse(storedUser) : null;

  console.log(user);
  console.log(admin);
  console.log("Admin token:", admin ? admin.token : "No admin token found");
  console.log("User token:", user ? user.token : "No user token found");
  return (
   
      <div>

        <Routes>


          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />


          <Route path="/courses" element={user ? <Courses /> : <Navigate to={"/login"} />} />
          <Route path="/buy/:courseId" element={user ? <Buy /> : <Navigate to={"/login"} />} />
          <Route path="/purchases" element={user ? <Purchases /> : <Navigate to={"/login"} />} />
          {/* <Route path="/view/:filename" element={user ? <Purchases /> : <Navigate to={"/login"} />} /> */}
          <Route path="/setting" element={user ? <Settings /> : <Navigate to={"/login"} />} />
          <Route path='/profile' element={user ? <Profile /> : <Navigate to={"/login"} />} />
          <Route path="/edit-profile" element={user ? <UpdateProfile /> : <Navigate to={"/login"} />} />


          <Route path="/admin/signup" element={<AdminSignup />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          {/* <Route path="/admin/dashboard" element={admin ? <Dashboard /> : <Navigate to="/admin/login" replace />} /> */}
          <Route
            path="/admin/dashboard"
            element={admin ? <Dashboard /> : <Navigate to="/admin/login" replace />}
          />

          <Route path="/admin/create-course" element={admin ? <CourseCreate /> : <Navigate to="/admin/login" replace />} />
          <Route path="/admin/update-course/:id" element={admin ? <UpdateCourse /> : <Navigate to="/admin/login" replace />} />
          <Route path="/admin/our-courses" element={admin ? <OurCourses /> : <Navigate to="/admin/login" replace />} />

        </Routes>
        <Toaster />

      </div>
  )
}

export default App