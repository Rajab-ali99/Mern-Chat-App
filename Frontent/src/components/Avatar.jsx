import React from 'react'
import { LuUserCircle2 } from "react-icons/lu";
import { useSelector } from 'react-redux';
const Avatar = ({userId,name,height,width,imageUrl}) => {
  let avatarName= ""
  if(name){

    const splitName= name.split(" ")
    if(splitName.length > 1){
      avatarName =splitName[0][0]+splitName[1][0]
    }else{
      avatarName =splitName[0][0]
      
    }
  }
  const onlineUser= useSelector(state=> state?.user?.onlineUser)
  const isOnline= onlineUser.includes(userId)
  let bgcolor =[
    'bg-slate-200',
    'bg-red-200',
    'bg-green-200',
    'bg-sky-200',
    'bg-yellow-200',
    'bg-purple-200',
    'bg-blue-200',
    'bg-indigo-200',
    
  ]
  let randomNumber = Math.floor(Math.random() * 8)
  return (
  <div className='text-slate-800 relative flex '>
    {
      imageUrl ?(
          <img style={{width: width + "px", height:height + 'px'}} className='overflow-hidden  rounded-full '
          src={`${imageUrl}`}
          width={width}
          height={height}
          alt={name}
          />
      ):(
         name ? (
          <div style={{width: width + "px", height:height + 'px'}} className={`overflow-hidden shadow border font-bold  rounded-full flex items-center justify-center ${bgcolor[randomNumber]} `}>
             {avatarName}
          </div>  
         ):(
        
          <LuUserCircle2
            size={width}
          />
        )
      )
    }
    {
      isOnline &&(
        <div className='rounded-full bg-primary absolute bottom-1 p-1 right-1'></div>
      )
    }
  </div>
  )
}

export default Avatar
