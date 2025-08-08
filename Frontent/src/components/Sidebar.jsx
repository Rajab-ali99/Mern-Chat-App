import React, { useEffect, useState } from 'react'
import { AiFillMessage } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import Avatar from '../components/Avatar'
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { FaImages } from "react-icons/fa6";
import { MdOutlineVideoLibrary } from "react-icons/md";
import SearchUser from './searchUser';
import { PiArrowBendDoubleUpLeftLight } from "react-icons/pi";

import EditUserDetails from '../components/EditUserDetails'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/user/userSlice';
const Sidebar = () => {
  const user = useSelector(state => state.user)
  
  const [editUserOpen, seteditUserOpen] = useState(false)
  const [openSearchUser, setOpenSearchUser] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const SocketConnection = useSelector(state => state?.user?.socketConnection)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (SocketConnection) {
      SocketConnection.emit('Sidebar', user._id)
      SocketConnection.on('conversation', (data) => {
        console.log('conversation', data)
        const conversationUserData = data.map((conversationUser, index) => {
          if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            }
          }
          else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver
            }


          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender
            }


          }
        })
        setAllUsers(conversationUserData)
      })
    }
  }, [SocketConnection, user])
  const handleLogout = ()=>{
    dispatch(logout())
    navigate('/email')
    localStorage.clear()
  }
  return (
    <div className='bg-white  grid grid-cols-[48px,1fr]  w-screen lg:w-[300px] h-[100dvh] '>
      <div className='bg-slate-200 w-12  h-full py-3 rounded flex flex-col justify-between '>
        <div className='flex flex-col gap-3'>

          <NavLink className={(e) => { return e.isActive ? "w-12  h-12 flex items-center cursor-pointer rounded justify-center bg-slate-300" : 'w-12 h-12 flex items-center cursor-pointer rounded justify-center' }} title='Messeges'>
            <AiFillMessage
              size={25}
            />
          </NavLink>

          <NavLink className={(e) => { return e.isActive ? "w-12 h-12 flex  items-center cursor-pointer rounded justify-center bg-slate-300" : 'w-12 h-12 flex items-center cursor-pointer rounded justify-center' }} title='Add contact'>
            <FaUserPlus
              onClick={() => { setOpenSearchUser(true) }}
              size={25}
            />
          </NavLink>

          <div >
            <button onClick={() => { seteditUserOpen(true) }} title='User'>

              <Avatar

                height={45}
                width={45}
                name={user?.name}
                imageUrl={user?.profile_pic}
                userId={user?._id}

              />
            </button>
          </div>
        </div>
        <div className='flex flex-col gap-3'>

          <NavLink className={(e) => { return e.isActive ? "w-12 h-12 flex items-center cursor-pointer rounded justify-center bg-slate-300" : 'w-12 h-12 flex items-center cursor-pointer rounded justify-center' }} title='logout' onClick={handleLogout}>
            <button>
              <BiLogOut
                size={25}
              />
            </button>
          </NavLink>
        </div>
      </div>
      <div className=' '>
        <h2 className='text-xl h-14 flex items-center ml-3 font-bold'>Message</h2>
        <div className='bg-slate-200 h-[1px]'></div>
        <div className=' h-[calc(100vh-57px)] overflow-x-hidden overflow-y-auto scrollbar'>
          {
            allUsers.length === 0 && (

              <div className='flex justify-center my-8 gap-3 items-center flex-col'>
                <PiArrowBendDoubleUpLeftLight className='text-4xl' />
                <p className='text-slate-600 font-semibold text-center'>Explore users to start a conversation with.</p>
              </div>
            )
          }
          {
            allUsers.map((conv, index) => {
              return (
                <div key={index} className='hover:bg-slate-100 cursor-pointer rounded mt-1'>

                  <NavLink to={'/' + conv?.userDetails?._id} key={conv?._id} className=''>
                    <div className='flex items-center p-2    gap-3'>
                      <Avatar
                        imageUrl={conv?.userDetails?.profile_pic}
                        height={45}
                        width={45}
                        name={conv?.userDetails?.name}
                      />
                      <div className='flex  flex-col'>
                        <h1 className='text-ellipsis line-clamp-1 font-semibold '>{conv?.userDetails?.name}</h1>
                        <div>
                          {
                            conv?.lastMsg?.ImageUrl && (
                              <div className='flex items-center gap-3'>
                                <div><FaImages /></div>
                                {!conv?.lastMsg?.text && <span className='text-xs text-slate-500'>Image</span>}
                              </div>
                            )
                          }
                          {
                            conv?.lastMsg?.videoUrl && (
                              <div className='flex items-center gap-3'>
                                <div className='text-slate-500'><MdOutlineVideoLibrary /></div>
                                {!conv?.lastMsg?.text && <span className='text-xs text-slate-500'>video</span>}
                              </div>
                            )
                          }
                        </div>
                        <p className='text-xs text-slate-500 text-ellipsis line-clamp-1'>{conv?.lastMsg?.text}</p>
                      </div>
                      {
                        Boolean(conv?.unseenMsg) &&(
                      <p className='bg-primary p-1 h-6 w-6 flex items-center justify-center rounded-full text-white text-xs  ml-auto  '>
                        {conv?.unseenMsg}
                      </p>

                        )
                      }
                    </div>
                  </NavLink>
                </div>
              )
            })
          }
        </div>

      </div>
      {/**edit user*/}
      {
        editUserOpen && (
          <EditUserDetails onClose={() => { seteditUserOpen(false) }} user={user} />
        )
      }
      {/**open search user */}
      {
        openSearchUser && (
          <SearchUser onClose={() => { setOpenSearchUser(false) }} />
        )
      }
    </div>
  )
}

export default Sidebar
