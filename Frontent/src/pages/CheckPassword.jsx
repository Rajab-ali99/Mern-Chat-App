import React from 'react'
import { IoClose } from "react-icons/io5";
import { useState,useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import { LuUserCircle2 } from "react-icons/lu";
import Avatar from '../components/Avatar';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import {setToken}from '../redux/user/userSlice'
const CheckPassword = () => {
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState({
    password: "",
    userId : "",



    
  })
  const location =useLocation()
  const dispatch =useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if(!location?.state?.name){
      navigate('/email')
    }
  }, [])
  
  const handleOnChange = (e) => {
    const { name, value } = e.target
    setdata((preve) => {
      return {
        ...preve,
        [name]: value
      }

    })
  }
  const handleSubmit =async (e) => {
    setloading(true)
     e.preventDefault()
     e.stopPropagation()
     const url=`${import.meta.env.VITE_BACKEND_URL}/api/password`
    try {
        const response=await axios({
          url : url,
          data:{
            userId: location?.state?._id,
            password:data.password
          },
          withCredentials:true,
          method: 'post'
        })
        toast.success(response.data.message)
        if(response.data.success){
          dispatch(setToken(response?.data?.token))
          localStorage.setItem('token',response?.data?.token)       
          setdata({
              password: "",           
          })
          setloading(false)
          navigate('/')
        }
       
    } catch (error) {
      toast.error(error?.response?.data?.message)
       setloading(false)
      console.log(error)
    }
  }
  return (
    <div className='bg-white max-w-sm my-5 mx-3 md:mx-auto p-5'>
      <div className='flex items-center justify-center flex-col'>
      <Avatar 
      imageUrl={location?.state?.porfile_pic}
      name={location?.state?.name}
      
      width={70}
      height={70}
      
      />
      <h2 className='font-semibold my-2'>{location?.state?.name}</h2>
      </div>
      <div className='mb-4 text-center font-bold'>Welcome to chat App!</div>
      <form className='' onSubmit={handleSubmit}>


        <label htmlFor="password">Password:</label>
        <div className='bg-slate-100  mb-3'>
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


        <button className='bg-primary text-white rounded w-full my-5 flex justify-center items-center  leading-relaxed tracking-wide py-1 font-bold hover:bg-secondary'>
         {
            loading?(<span className="loader "></span>):(
              <span>Log In</span>
              

            )
          }
        </button>


      </form>
      <p className='text-center'><Link to={'/forgot-password'} className='hover:text-primary mx-1 font-semibold'>Forgot Password?</Link></p>
    </div>
  )
}

export default CheckPassword

