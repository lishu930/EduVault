// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios'

// export default function Buy() {
//   const { courseId } = useParams()
//   const [loading, setLoading] = useState(false)
//   const navigate = useNavigate()

//   const user = JSON.parse(localStorage.getItem('user', JSON.stringify({ token: response.data.token })));
//   const token = localStorage.getItem('user');

//   const handlePurchase = async () => {
//     // console.log("User from localStorage:", user);
//     // console.log("Token:", token);
//     if (!token) {
//       toast.error("Please login to purchase the courses");
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.post(`http://localhost:4001/api/v1/course/buy/${courseId}`,
//         {}, {
//         headers: {
//           Authorization: `Bearer ${token}`
//         },
//         withCredentials: true,

//       })
//       toast.success(response.data.message || "Course purchased successfully!")
//       navigate("/purchased")
//       setLoading(false)
//       console.log("Backend connected")
//     } catch (error) {
//       setLoading(false)
//       if (error.response?.status === 400) {
//         toast.error("You have already purchased this course")
//         navigate("/purchased")
//       } else {
//         // toast.error(error?.response?.data?.errors)
//         toast.error(error?.response?.data?.errors)
//       }
//     }
//   }
//   return (
//     <>
//       {error ? (
//         <div className="flex justify-center items-center h-screen">
//           <div className='bg-red-100  text-red-700 px-6 py-4 rounded-lg'>
//             <p className='text-lg font-semibold'>{error}</p>
//             <Link className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
//               to={"/purchases"}
//             >
//               Purchases
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div className='flex flex-col sm:flex-row my-40 container mx-auto'>
//           <div className=" w-full md:w-1/2">
//             <h1 className='text-xl font-semibold underline'>Order Details</h1>
//             <div className='flex items-center text-center space-x-2 mt-4'>
//               <h2 className='text-gray-600 text-sm'>Total Price</h2>
//               <p className='text-red-500 font-bold'>${course.price}</p>
//             </div>
//             <div className='flex items-center text-center space-x-2'>
//               <h1 className='text-gray-600 text-sm'>Course name</h1>
//               <p className='text-red-500 font-bold'>{course.title}</p>
//             </div>
//           </div>
//           <div className='w-full md:w-1/2 flex justify-center items-center'>
//             <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-sm'>
//               <h2 className='text-lg font-semibold mb-4'>
//                 process your payment!
//               </h2>
//               <div className='mb-4'>
//                 <label className="block text-gray-700 text-sm mb-2 "
//                   htmlFor="card-number"
//                 >
//                   Credit/Debit Card
//                 </label>
//                 <form onSubmit={handlePurchase}>
//                   <CardElement 
//                   options={{
//                     style:{
//                         base:{
//                               fontSize:"16px",
//                               color:"#424770",
//                               "::placeholder":{
//                                 color:"#aab7c4",
//                               },
//                         },
//                         invalid:{
//                           color:"#9e2146",
//                         }
//                     },
//                   }}
//                   />
//                   <button 
//                   type="submit"
//                   disabled={!stripe || loading}
//                   className='mt-8 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200'
//                   >
//                     {loading ? "Processing..":"Pay"}
//                   </button>
//                 </form>
//                 {cardError &&(
//                   <p className='text-red-500 font-semibold text-xs'>
//                     {cardError}
//                   </p>
//                 )}
//               </div>
//               <button className='w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center'>
//                 <span className='mr-2'>*P</span>Other Payment Method
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// import React, { useState } from 'react';
// import toast from 'react-hot-toast';
// import { useNavigate, useParams, Link } from 'react-router-dom';
// import axios from 'axios';

// export default function Buy() {
//   const { courseId } = useParams();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem('user'));
//   const token = user?.token;

//   const handlePurchase = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       toast.error("Please login to purchase the courses");
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `http://localhost:4001/api/v1/course/buy/${courseId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       toast.success(response.data.message || "Course purchased successfully!");
//       navigate("/purchases");
//     } catch (err) {
//       setLoading(false);
//       if (err.response?.status === 400) {
//         toast.error("You have already purchased this course");
//         navigate("/purchases");
//       } else {
//         setError(err.response?.data?.errors || "Something went wrong");
//         toast.error(err.response?.data?.errors || "Something went wrong");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {error ? (
//         <div className="flex justify-center items-center v-screen">
//           <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
//             <p className="text-lg font-semibold">{error}</p>
//             <Link
//               className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
//               to="/purchases"
//             >
//               Purchases
//             </Link>
//           </div>
//         </div>
//       ) : (
//         <div className="flex h-screen items-center justify-center">
//           <button
//             className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-800 duration-300"
//             onClick={handlePurchase}
//             disabled={loading}
//           >
//             {loading ? "Processing..." : "Buy Now"}
//           </button>
//         </div>
//       )}
//     </>
//   );
// }


// import React, { useState, useEffect } from "react";
// import toast from "react-hot-toast";
// import { useNavigate, useParams, Link } from "react-router-dom";
// import axios from "axios";

// export default function Buy() {
//   const { courseId } = useParams();
//   const [course, setCourse] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = user?.token;

//   // Fetch course details
//   useEffect(() => {
//     const fetchCourse = async () => {
//       try {
//         // const response = await axios.get(
//         //   `http://localhost:4001/api/v1/course/buy/${courseId}`,
//         //   {
//         //     headers: { Authorization: `Bearer ${token}` },
//         //     withCredentials: true,
//         //   }
//         const response = await axios.post(
//         `http://localhost:4001/api/v1/course/buy/${courseId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//         );
//         setCourse(response.data.course);
//       } catch (err) {
//         setError("Failed to load course details");
//       }
//     };
//     fetchCourse();
//   }, [courseId, token]);

//   const handlePurchase = async (e) => {
//     e.preventDefault();
//     if (!token) {
//       toast.error("Please login to purchase the courses");
//       return;
//     }
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `http://localhost:4001/api/v1/course/buy/${courseId}`,
//         {},
//         {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true,
//         }
//       );
//       toast.success(response.data.message || "Course purchased successfully!");
//       navigate("/purchases");
//     } catch (err) {
//       if (err.response?.status === 400) {
//         toast.error("You have already purchased this course");
//         navigate("/purchases");
//       } else {
//         setError(err.response?.data?.errors || "Something went wrong");
//         toast.error(err.response?.data?.errors || "Something went wrong");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
//           <p className="text-lg font-semibold">{error}</p>
//           <Link
//             className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
//             to="/purchases"
//           >
//             Purchases
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   if (!course) {
//     return (
//       <div className="flex h-screen items-center justify-center">
//         <p className="text-gray-600">Loading course details...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg overflow-hidden">
//       <img
//         src={course.image?.url || "default-image.jpg"}
//         alt={course.title}
//         className="h-60 w-full object-cover"
//       />
//       <div className="p-6">
//         <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
//         <p className="text-gray-700 mb-4">{course.description}</p>
//         <p className="text-lg font-semibold text-green-600 mb-4">
//           Price: ₹{course.price}
//         </p>
//         <button
//           className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-800 duration-300"
//           onClick={handlePurchase}
//           disabled={loading}
//         >
//           {loading ? "Processing..." : "Buy Now"}
//         </button>
//       </div>
//     </div>
//   );
// }

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const token = user?.token;

  const handlePurchase = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to purchase the courses");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `http://localhost:4001/api/v1/course/buy/${courseId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Course purchased successfully!");
      navigate("/purchases");
    } catch (err) {
      setLoading(false);
      if (err.response?.status === 400) {
        toast.error("You have already purchased this course");
        navigate("/purchases");
      } else {
        setError(err.response?.data?.errors || "Something went wrong");
        toast.error(err.response?.data?.errors || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error ? (
        <div className="flex justify-center items-center h-screen bg-gradient-to-r from-red-50 to-orange-50">
          <div className="bg-white shadow-xl rounded-lg p-8 max-w-md text-center border border-red-200">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Purchase Failed</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-md hover:from-orange-600 hover:to-red-600 transition duration-300 shadow-lg"
              to="/purchases"
            >
              Go to Enrolled Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100">
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transform hover:scale-105 transition duration-300"
            onClick={handlePurchase}
            disabled={loading}
          >
            {loading ? "Processing..." : "Enroll Now"}
          </button>
        </div>
      )}
    </>
  );
}