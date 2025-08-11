import React from 'react'
import { IoClose } from "react-icons/io5";
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/uploadFile';
import { LuUserCircle2 } from "react-icons/lu";
import axios from 'axios';
import toast from 'react-hot-toast';
const CheckEmail = () => {
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState({
    email: "",
   
    
  })
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
  const handleSubmit =async (e) => {
    setloading(true)
     e.preventDefault()
     e.stopPropagation()
     const url=`${import.meta.env.VITE_BACKEND_URL}/api/email`
    try {
        const response=await axios.post(url,data)
        toast.success(response.data.message)
        if(response.data.success){
          setdata({
              email: "",           
          })
          setloading(false)
          navigate('/password',{
            state: response?.data?.data
          })
        }
    } catch (error) {
      toast.error(error?.response?.data?.message)
      setloading(false)
      console.log(error)
    }
  }
  return (
    <div className='bg-white max-w-sm my-5 mx-3 md:mx-auto p-5'>
      <LuUserCircle2
      className=' w-fit m-auto mb-3'
      size={70}
      />
      <div className='mb-4 text-center font-bold'>Welcome to chat App!</div>
      <form className='' onSubmit={handleSubmit}>


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


       <button className='bg-primary text-white flex items-center justify-center rounded w-full my-5  leading-relaxed tracking-wide py-1 font-bold hover:bg-secondary'>
          {
            loading?(<span className="loader "></span>):(
              <span>Log In</span>
              

            )
          }

          </button>


      </form>
      <p>New User?<Link to={'/register'} className='hover:text-primary mx-1 font-semibold'>Register</Link></p>
    </div>
  )
}

export default CheckEmail


