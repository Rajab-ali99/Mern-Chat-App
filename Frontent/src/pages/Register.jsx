import React from 'react'
import { IoClose } from "react-icons/io5";
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import axios from 'axios';
import toast from 'react-hot-toast';
const Register = () => {
  const [loading, setloading] = useState(false)
  const [loading1, setloading1] = useState(false)
  const [data, setdata] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
    
  })
  const [uploadphoto, setuploadphoto] = useState("")
  const navigate = useNavigate()
  const handleOnChange = (e) => {
    const { name, value } = e.target
    setdata((preve) => {
      return {
        ...preve,
        [name]: value
      }

    })
  }
  const handleUploadPhoto = async(e) => {
    const file = e.target.files[0]
    setloading1(true)
    const uploadPhoto= await uploadFile(file)
    setuploadphoto(file)
    setdata((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }

    })
    setloading1(false)
  }
  const handleClose = (e) => {
    e.stopPropagation()
    e.preventDefault()
    setuploadphoto(null)
  }
  const handleSubmit =async (e) => {
    setloading(true)
     e.preventDefault()
     e.stopPropagation()
     const url=`${import.meta.env.VITE_BACKEND_URL}/api/register`
    try {
        const response=await axios.post(url,data)
        toast.success(response.data.message)
        if(response.data.success){
          setloading(false)
          setdata({
            
              name: "",
              email: "",
              password: "",
              profile_pic: "",
          
            
          })
          navigate('/email')
        }
        console.log('response',response)
    } catch (error) {
      toast.error(error?.response?.data?.message)
      console.log(error)
    }
  }
  return (
    <div className='bg-white max-w-sm my-5 mx-3 md:mx-auto p-5'>
      <div className='mb-4 text-center font-bold'>Welcome to chat App!</div>
      <form className='' onSubmit={handleSubmit}>


        <label htmlFor="name">Name:</label>
        <div className='bg-slate-100  mb-3'>
          <input
            className='bg-transparent p-1 w-full focus:outline-primary rounded'
            type="text"
            id='name'
            name='name'
            placeholder='Enter your name'
            required
            onChange={handleOnChange}
            value={data.name}
          />
        </div>


        <label htmlFor="email">Email:</label>
        <div className='bg-slate-100  mb-3'>
          <input
            className='bg-transparent p-1 w-full focus:outline-primary rounded'
            type="email"
            id='email'
            name='email'
            placeholder='Enter your email'
            required
            onChange={handleOnChange}
            value={data.email}
          />
        </div>


        <label htmlFor="password">password:</label>
        <div className='bg-slate-100'>
          <input
            className='bg-transparent p-1 w-full focus:outline-primary rounded'
            type="password"
            id='password'
            name='password'
            placeholder='Enter your password'
            required
            onChange={handleOnChange}
            value={data.password}
          />
        </div>


        <label htmlFor="profile_pic">
          photo:
          <div className='bg-slate-200 flex justify-center'>
            <p className='bg-slate-200 p-3 max-w-[300px] rounded text-ellipsis line-clamp-1  cursor-pointer flex items-center justify-center'>
              {
                loading1 ? (
                  <span className="loader"></span>
                ):(<span>{uploadphoto?.name || "Upload profile pic"}</span>)
              }
            </p>
              {uploadphoto?.name && (
                <button onClick={handleClose} className='cursor-pointer hover:text-red-600'>
                  <IoClose className='text-xl flex items-center ml-3' />
                </button>
              )}
          </div>
        </label>
        <div className='bg-slate-100'>
          <input
            className='bg-transparent p-1 w-full focus:outline-primary rounded hidden'
            type="file"
            id='profile_pic'
            name='profile_pic'
            onChange={handleUploadPhoto}
          />
        </div>


        <button className='bg-primary text-white rounded w-full my-5 flex items-center justify-center  leading-relaxed tracking-wide py-1 font-bold hover:bg-secondary'>
         {
            loading?(<span className="loader "></span>):(
              <span>Log In</span>
              

            )
          }
        </button>


      </form>
      <p>Already have account?<Link to={'/email'} className='hover:text-primary mx-1 font-semibold'>Login</Link></p>
    </div>
  )
}

export default Register
