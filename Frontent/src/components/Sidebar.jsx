import React, { useState } from 'react'
import { AiFillMessage } from "react-icons/ai";
import { BiLogOut } from "react-icons/bi";
import { FaUserPlus } from "react-icons/fa";
import Avatar from '../components/Avatar'
import { NavLink } from 'react-router-dom';
import SearchUser from './searchUser';
import { PiArrowBendDoubleUpLeftLight } from "react-icons/pi";

import EditUserDetails from '../components/EditUserDetails'
import { useSelector } from 'react-redux';
const Sidebar = () => {
  const user = useSelector(state=>state.user)
  const [editUserOpen,seteditUserOpen]=useState(false)
  const [openSearchUser, setOpenSearchUser] = useState(false)
  const [allUsers, setAllUsers] = useState([])
    return (
    <div className='bg-white grid grid-cols-[48px,1fr]  w-screen lg:w-[300px] h-[100vh] '>
      <div className='bg-slate-200 w-12  h-full py-3 rounded flex flex-col justify-between '>
        <div className='flex flex-col gap-3'>

          <NavLink className={(e) => { return e.isActive ? "w-12  h-12 flex items-center cursor-pointer rounded justify-center bg-slate-300" : 'w-12 h-12 flex items-center cursor-pointer rounded justify-center' }} title='Messeges'>
            <AiFillMessage
              size={25}
            />
          </NavLink>
          
          <NavLink className={(e) => { return e.isActive ? "w-12 h-12 flex  items-center cursor-pointer rounded justify-center bg-slate-300" : 'w-12 h-12 flex items-center cursor-pointer rounded justify-center' }} title='Add contact'>
            <FaUserPlus
            onClick={()=>{setOpenSearchUser(true)}}
              size={25}
              />
          </NavLink>
             
          <div >
            <button  onClick={()=>{seteditUserOpen(true)}} title='User'>

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
          
          <NavLink className={(e) => { return e.isActive ? "w-12 h-12 flex items-center cursor-pointer rounded justify-center bg-slate-300" : 'w-12 h-12 flex items-center cursor-pointer rounded justify-center' }} title='logout'>
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
            allUsers.length===0 &&(

              <div className='flex justify-center my-8 gap-3 items-center flex-col'>
         <PiArrowBendDoubleUpLeftLight className='text-4xl'/>
         <p className='text-slate-600 font-semibold text-center'>Explore users to start a conversation with.</p>
        </div>
            )
        }
        </div>

      </div>
      {/**edit user*/}
      {
        editUserOpen &&(
          <EditUserDetails onClose={()=>{seteditUserOpen(false)}} user={user}/>
        )
        }
      {/**open search user */}
      {
        openSearchUser &&(
          <SearchUser onClose={()=>{setOpenSearchUser(false)}}/>
        )
      }
    </div>
  )
}

export default Sidebar
