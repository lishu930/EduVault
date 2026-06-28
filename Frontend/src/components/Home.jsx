import React, { useEffect } from 'react'
import logo from '../../public/logo.webp'
import syllabus from '../assets/Syllabus-BCA Core Course-CC1-CC14.pdf'
import { Link } from 'react-router-dom'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import axios from 'axios';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import toast from 'react-hot-toast';

const SliderComponent = Slider.default ? Slider.default : Slider;
function Home() {
    const [courses, setCourses] = React.useState([]);
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [])

    const handleLogout = async () => {
        try {
            const response = axios.get("http://localhost:4001/api/v1/user/logout", {
                withCredentials: true,
            })
            toast.success((await response).data.message);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            toast.success("You have been logged out.");

        } catch (error) {
            console.log("Error in logging out:", error);
            toast.error(error.response.data.errors || "Error in logging out");
        }
    }

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get("http://localhost:4001/api/v1/course/getcourses",
                    {
                        withCredentials: true
                    }
                )
                console.log(response.data);
                setCourses(response.data.courses);
            } catch (error) {
                console.log("Error fetching courses:", error);
            }
        };
        fetchCourses();
    }, []);

    var settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        initialSlide: 0,
        autoplay: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 2,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    };

    return (
        <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen">
            <div className="text-white container mx-auto px-4">
                {/* Header */}
                <header className="flex flex-col md:flex-row items-center justify-between p-6 space-y-4 md:space-y-0">
                    <div className="flex items-center space-x-2">
                        <img src={logo} alt="Logo" className="w-14 h-14 rounded-full" />
                        <h1 className="text-2xl text-orange-500 font-bold">EduVault</h1>
                    </div>
                    <div className="space-x-2 flex flex-wrap justify-center">
                        {isLoggedIn ? (
                            <button
                                onClick={handleLogout}
                                className="bg-transparent text-white py-2 px-4 border border-white rounded"
                            >
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="bg-transparent text-white py-2 px-4 border border-white rounded"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-transparent text-white py-2 px-4 border border-white rounded"
                                >
                                    Signup
                                </Link>
                            </>
                        )}
                    </div>
                </header>

                {/* Hero Section */}
                <section className="text-center mt-12 md:mt-20 px-4">
                    <h1 className="text-3xl md:text-4xl font-semibold text-orange-500">
                        Welcome to EduVault!
                    </h1>
                    <p className="text-gray-400 mt-4">
                        Sharpen your skills with courses crafted by experts.
                    </p>
                    <p className="text-orange-500 mt-2">"Helpful for university students."</p>
                    <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
                        <Link
                            to="/courses"
                            className="bg-green-500 text-white py-3 px-6 rounded font-semibold hover:bg-white duration-300 hover:text-black"
                        >
                            Explore Courses
                        </Link>
                        <a
                            href= {syllabus}
                            className="bg-white text-black py-3 px-6 rounded font-semibold hover:bg-green-500 duration-300 hover:text-white"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Courses Syllabus
                        </a>
                    </div>
                </section>

                <section>
                    <SliderComponent {...settings}>
                        {

                            courses.map((course) => (
                                <div key={course._id} className="p-6 mt-2 ">
                                    <div className=" relative flex-shrink-0 w-92 transition-transform duration-300 transform hover:scale-105">
                                        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
                                            <img className="h-32 w-full object-contain mt-2" src={course.image ? course.image?.url : "https:placeholder.com"} alt={course.title} />
                                            <div className='p-6 text-center'>
                                                <h2 className="text-xl font-bold text-white">
                                                    {course.title}
                                                </h2>
                                                <Link to={`/buy/${course._id}`} ><button className='mt-4 bg-orange-500 text-white py-2 px-4 rounded-full hover:bg-blue-500'>Enroll Now</button></Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </SliderComponent>

                </section>


                <hr className="my-8 border-gray-700" />

                {/* Footer */}
                <footer className="bg-gradient-to-r from-black to-blue-950 px-6 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Logo & Socials */}
                        <div className="flex flex-col items-center md:items-start">
                            <div className="flex items-center space-x-2">
                                <img src={logo} alt="Logo" className="w-14 h-14 rounded-full" />
                                <h1 className="text-2xl text-orange-500 font-bold">CourseHaven</h1>
                            </div>
                            <div className="mt-3">
                                <p className="mb-2">Follow us</p>
                                <div className="flex space-x-4">
                                    <a href="#">
                                        <FaFacebook className="text-2xl hover:text-blue-400 duration-300" />
                                    </a>
                                    <a href="#">
                                        <FaInstagram className="text-2xl hover:text-pink-600 duration-300" />
                                    </a>
                                    <a href="#">
                                        <FaTwitter className="text-2xl hover:text-blue-600 duration-300" />
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Copyrights */}
                        <div className="flex flex-col items-center md:items-end">
                            <h3 className="text-lg font-semibold mb-4">Copyrights &#169; 2026</h3>
                            <ul className="space-y-2 text-gray-400">
                                <li className="hover:text-white cursor-pointer duration-300">
                                    Terms & Conditions
                                </li>
                                <li className="hover:text-white cursor-pointer duration-300">
                                    Privacy Policy
                                </li>
                                <li className="hover:text-white cursor-pointer duration-300">
                                    Refund & Cancellation
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    )
}

export default Home;
