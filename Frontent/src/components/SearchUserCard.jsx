import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'

const SearchUserCard = ({ user,onClose}) => {
  return (
    <>
      <Link to={"/"+ user?._id} onClick={onClose} className='flex gap-3 items-center p-3 border border-transparent border-b-slate-200 hover:border hover:border-primary cursor-pointer rounded'>

        <div className=' '>
          <Avatar
            height={50}
            width={50}
            imageUrl={user?.profile_pic}
            name={user?.name}
            userId={user?._id}
          />
        </div className=' w-[70%] '>
        <div>
          <div className='font-semibold  text-ellipsis  line-clamp-1'>{user?.name}</div>
          <p className='text-ellipsis line-clamp-1'>{user?.email}</p>
        </div>

      </Link >
    </>



  )
}

export default SearchUserCard
