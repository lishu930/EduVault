import axios from 'axios';
import { React, useState } from 'react'
import toast from 'react-hot-toast';
import { IoReturnDownBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

export default function CourseCreate() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [pyqs, setPyqs] = useState("");
  const [notes, setNotes] = useState("");
  const [practice, setPractice] = useState("");
  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImagePreview(reader.result)
      setImage(file)
    }
  }

  const handleCreateCourse = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("image", image)
    formData.append("creatorId", JSON.parse(localStorage.getItem("admin")).admin?._id)
    formData.append("pyqs", pyqs)
    formData.append("notes", notes)
    formData.append("practice", practice)

    const admin = JSON.parse(localStorage.getItem("admin"))
    // const token = admin.token;
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/create-course");
      return;
    }
    try {
      const response = await axios.post("http://localhost:4001/api/v1/course/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      console.log(response.data)
      // toast.success(data.message || "Course created successfully")
      // console.log("Navigating to our courses page...");
      // navigate("/admin/our-courses");
      toast.success(response.data.message || "Course created successfully!");
      console.log("Created course:", response.data.course);

      // ✅ navigate after success
      navigate("/admin/our-courses");

      setTitle("")
      setPrice("")
      setImage("")
      setDescription("")
      setImagePreview("")
      setPyqs("")
      setNotes("")
      setPractice("")
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.errors)
    }
  }

  return (
    <div>
      <Link
        className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300 mt-5 ml-10 flex items-center gap-1 w-max"
        to="/admin/dashboard"
      >
        Go to dashboard
      </Link>
      <div className='min-h-screen py-10'>
        <div className='max-w-4xl mx-auto p-6 border rounded-lg shadow-lg'>
          <h3 className='text-2xl font-semibold mb-8'>Create Course</h3>
          <form onSubmit={handleCreateCourse} className='space-y-6'>
            <div className='space-y-2'>
              <label className='block text-lg'>Title</label>
              <input type='text'
                placeholder='Enter your course title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none' />
            </div>
            <div className='space-y-2'>
              <label className='block text-lg'>Description</label>
              <input type='text'
                placeholder='Enter your course description'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none' />
            </div>
            <div className='space-y-2'>
              <label className='block text-lg'>Price</label>
              <input type='text'
                placeholder='Enter your course price'
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none' />
            </div>
            <div className='space-y-2'>
              <label className='block text-lg'>Course Image</label>
              <div className='flex items-center justify-center'>
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt='Image'
                  className='w-full max-w-sm h-auto rounded-md object-cover'
                />
              </div>
              <input type='file'
                onChange={changePhotoHandler}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none' />
            </div>
            <div className='space-y-2'>
              <label className='block text-lg'>Course PYQs</label>

              <input type='file'
                onChange={(e) => setPyqs(e.target.files[0])}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none' />
            </div>
            <div className='space-y-2'>
              <label className='block text-lg'>Course Practice Questions</label>
              <input type='file'
                onChange={(e) => setPractice(e.target.files[0])}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none' />
            </div>
            <div className='space-y-2'>
              <label className='block text-lg'>Course Notes</label>
              <input type='file'
                onChange={(e) => setNotes(e.target.files[0])}
                className='w-full px-3 py-2 border border-gray-400 rounded-md outline-none' />
            </div>
            <button
              type='submit'
              className='w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200'
            >
              Create Course
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
