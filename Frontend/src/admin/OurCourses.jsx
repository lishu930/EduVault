 import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

export default function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const useradmin = localStorage.getItem("admin");
  const admin = useradmin ? JSON.parse(useradmin) : null;
  const token = localStorage.getItem("adminToken"); // ✅ use the token you saved at login

  console.log(admin)
  console.log(token)
  // ✅ run login check after render
  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4001/api/v1/course/getcourses",
          { withCredentials: true }
        );
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleDeletedCourse = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:4001/api/v1/course/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      setCourses(courses.filter((course) => course._id !== id));
    } catch (error) {
      console.log("Error in deleting course", error);
      toast.error(error.response?.data?.errors || "Error in deleting courses");
    }
  };
    console.log(courses)
  if (loading) {
    return <p className="text-center text-gray-500">Loading....</p>;
  }

  return (
    <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">Our Courses</h1>
      <Link
        className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
        to="/admin/dashboard"
      >
        Go to dashboard
      </Link>
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> */}
       {/* <div class="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
        {courses.map((course) => (
          <div key={course._id} className="bg-white shadow-md rounded-lg p-4">
            <img
              // src={course.image ? course.image : "default-image.jpg"}
              src={course.image?.url || "default-image.jpg"}
              alt={course.title}
              // className=" object-cover rounded-t-lg"
              className='w-full h-48 object-cover'
              
            />
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {course.title}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              {course.description.length > 200
                ? `${course.description.slice(0, 200)}...`
                : course.description}
            </p>
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              Rs {course.price}{" "}
              {/* <span className="line-through text-gray-500">Rs5000</span> */}
          {/*  </div>
            {/* <div className="text-green-600 text-sm mt-2">10% Off</div> */}
          {/*  <div className="flex justify-between mt-4">
              <Link
                to={`/admin/update-course/${course._id}`}
                className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Update
              </Link>
              <button
                onClick={() => handleDeletedCourse(course._id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {courses.map((course) => (
    <div
      key={course._id}
      className="bg-white shadow-md rounded-lg overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-2xl"
    >
      <img
        src={course.image?.url || "default-image.jpg"}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {course.title}
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          {course.description.length > 200
            ? `${course.description.slice(0, 200)}...`
            : course.description}
        </p>
        <div className="flex justify-between mt-4 text-gray-800 font-bold">
          Rs {course.price}
        </div>
        <div className="flex justify-between mt-4">
          <Link
            to={`/admin/update-course/${course._id}`}
            className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600 transition-colors duration-300"
          >
            Update
          </Link>
          <button
            onClick={() => handleDeletedCourse(course._id)}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition-colors duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
    </div>
  );
}