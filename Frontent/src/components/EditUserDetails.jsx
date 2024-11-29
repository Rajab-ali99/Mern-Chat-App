import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { useState,useMemo ,useEffect} from 'react'
import uploadFile from '../helpers/uploadFile'
import Avatar from './Avatar'
import Deveder from './Deveder'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/user/userSlice'
const EditUserDetails = ({ onClose, user }) => {
  const dispatch =useDispatch()
  const [data, setdata] = useState({
    name: user?.user,
    profile_pic: user?.profile_pic,
  })
  const UploadPhotoref =useRef()
   useEffect(() => {
    setdata((preve)=>{
        return{
          ...preve,
          ...user
        }
    })
  
  }, [user])

  const handleOpenUploadPhoto=(e)=>{

    e.preventDefault()
      e.stopPropagation()
     UploadPhotoref.current.click() 
  }

  
  const handleSubmit = async (e) => {
      e.preventDefault()
      e.stopPropagation()
      try {
             const url=`${import.meta.env.VITE_BACKEND_URL}/api/update-user`
             const response= await axios({
              method:'post',
              url:url,
              data:data,
              withCredentials:true
             })
            toast.success(response?.data?.message)
            if (response.data.success) {
              console.log('data',response.data)
              dispatch(setUser(response.data.data))
            }
      } catch (error) {
        console.log(error)
         toast.error(error?.response?.data?.message)
      }
  }
  const handleOnChange = (e) => {
    const {name, value} = e.target
    setdata((preve) => {
      return {
        ...preve,
        [name]: value

      }
    })
  }
  const handleUploadPhoto=async(e)=>{
    const file = e.target.files[0]
    const uploadPhoto= await uploadFile(file)
    
    setdata((preve) => {
      return {
        ...preve,
        profile_pic: uploadPhoto?.url
      }

    })
  }
  return (
    <div className='fixed top-0 right-0 left-0 bottom-0 z-10 bg-slate-600 flex justify-center items-center opacity-75'>
      <div className='bg-white rounded p-4 w-full max-w-sm'>
        <h2 className='font-bold text-center text-xl text-primary'>User Details</h2>
        <p className='text-xs text-center'>Edit user details</p>

        <form onSubmit={handleSubmit} method='post' className='flex flex-col  gap-4'>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              className='p-1 w-full outline-primary focus-within:bg-slate-100'
              type="text"
              name='name'
              id='name'
              value={data?.name}
              onChange={handleOnChange}
            />
          </div>
          <div>
            <div>Photo:</div>
            <div className='flex gap-3 items-center'>
              <div>
                <Avatar
                  height={40}
                  width={40}
                  name={data?.name}
                  imageUrl={data?.profile_pic}
                />
              </div>

              <div>
                <label htmlFor="profile_pic">
                <button onClick={handleOpenUploadPhoto} className='font-bold cursor-pointer'>Change photo</button>  
                  <input
                  className='hidden'
                  type="file"
                  name='prfile_pic'
                  ref={UploadPhotoref}
                  onChange={handleUploadPhoto}
                  />
                  </label>          
              </div>
            </div>
          </div>
          <Deveder/>
        <div className='flex gap-3 justify-end'>
        <button type='button' onClick={onClose} className='py-1 px-3 border font-semibold border-primary hover:text-white hover:bg-primary text-primary rounded'>Cancel</button>
        <button type='submit' onClick={handleSubmit} className='py-1 px-3 bg-primary font-semibold hover:bg-secondary text-white rounded'>Save</button>
        </div>
        </form>
      </div>
    </div>
  )
}

export default EditUserDetails
