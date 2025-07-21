import axios from 'axios'
import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout, setUser, setOnlineUser, setsocketConnection } from '../redux/user/userSlice'
import logo from '../assets/logo.png'
import Sidebar from '../components/sidebar'


import io from 'socket.io-client'


const Home = () => {
  const user = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const basepath = location.pathname === "/"

  const fetchUserDetails = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/user-Details`
      const response = await axios({
        url: url,
        withCredentials: true
      })
      dispatch(setUser(response.data.data))
      if (response.data.data.Logout) {
        dispatch(logout())
        navigate('/email')
      }

    } catch (error) {
      console.log("error", error)
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])
  /**socket connection */
  useEffect(() => {
    const socketConection = io(import.meta.env.VITE_BACKEND_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      auth: {
        token: localStorage.getItem('token')
      }
    })
    socketConection.on('onlineUser', (data) => {

      dispatch(setOnlineUser(data))
    })
    dispatch(setsocketConnection(socketConection))

    return () => {
      socketConection.disconnect()
    }

  }, [])

  return (
    <>
      <div className='flex flex-col lg:flex-row'>
        <section className={`${!basepath && 'hidden'}  lg:block`}>
          <Sidebar />
        </section>
        {/*Message component*/}
        <section className={`${basepath && 'hidden'} w-full`}>
          <Outlet className='' />
        </section>
        

          <div className={`${basepath ? 'lg:flex hidden gap-3 justify-center w-full items-center flex-col' : 'hidden'}`}>
            < img src={logo} alt=""
              width={220}
            />
            <p className='text-center pl-10 font-semibold text-slate-500'>Select user to start a chat</p>
          </div>
        
      </div>

    </>
  )
}

export default Home
