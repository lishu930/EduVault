import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UpdateCourse() {
  const { id } = useParams()

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [pyqs, setPyqs] = useState(null);
  const [notes, setNotes] = useState(null);
  const [practice, setPractice] = useState(null);

  const [loading, setLoading] = useState(true);


  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:4001/api/v1/course/getcourse/${id}`,
          {
            withCredentials: true,
          }
        );
        console.log(data);
        setTitle(data.course.title)
        setDescription(data.course.description)
        setPrice(data.course.price)
        setImagePreview(data.course.image?.url)
        setPyqs("")
        setNotes("")
        setPractice("")
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch course data")
        setLoading(false)
      }
    }
    fetchCourseData()
  }, [id])
  const changePhotoHandler = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImagePreview(reader.result)
      setImage(file)
    }
  }

  const handleUpdateCourse = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("price", price)
    if (image) {
      formData.append("image", image);
    }
    if (pyqs) {
      formData.append("pyqs", pyqs);
    }
    if (notes) {
      formData.append("notes", notes);
    }
    if (practice) {
      formData.append("practice", practice);
    }

    const admin = JSON.parse(localStorage.getItem("admin"))
    // const token = admin.token;
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/course-create ")
      return;
    }
    try {
      const response = await axios.put(`http://localhost:4001/api/v1/course/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      console.log(response.data)
      // toast.success(data.message || "Course updated successfully")
      // navigate("/admin/our-courses")
      toast.success(response.data.message || "Course created successfully!");
      console.log("Created course:", response.data.course);

      // ✅ navigate after success
      navigate("/admin/our-courses");
      setTitle("")
      setPrice("")
      setImage("")
      setDescription("")
      setImagePreview("")


    } catch (error) {
      console.log(error)
      toast.error(error.response.data.errors)
    }
  }


  return (
    <div>
      <div className='min-h-screen py-10'>
        <div className='max-w-4xl mx-auto p-6 border rounded-lg shadow-lg'>
          <h3 className='text-2xl font-semibold mb-8'>Update Course</h3>
          <form onSubmit={handleUpdateCourse} className='space-y-6'>
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
              Update Course
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
