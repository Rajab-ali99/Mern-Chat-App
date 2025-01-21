import React from 'react'
import { useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { BsThreeDotsVertical } from "react-icons/bs";
import Avatar from './Avatar'
import { FaAngleLeft } from "react-icons/fa6";
import { CgAttachment } from "react-icons/cg";
import uploadFile from '../helpers/uploadFile';
import { FaImages } from "react-icons/fa6";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import backgroundimage from '../assets/wallapaper.jpeg'
import LoadingSpinner from "./loadingSpinner"
import { LuSendHorizonal } from "react-icons/lu";
import moment from 'moment';
import Picker from 'emoji-picker-react';
import data from 'emoji-picker-react'
import { GrEmoji } from "react-icons/gr";

const Messages = () => {
  const [loading, setloading] = useState(false)
  const CurrentMsg = useRef(null)
  const [dataUser, setdataUser] = useState({
    _id: "",
    name: "",
    email: '',
    profile_pic: "",
    online: false,

  })
  const[openEmoji,setopenEmoji]=useState(false)
  const [allMessages, setAllMessages] = useState([])
  const [openImageVideo, setOpenImageVideo] = useState(false)
  const [messages, setMessages] = useState({
    text: "",
    ImageUrl: "",
    videoUrl: "",
   
  })
  const params = useParams()
  const user = useSelector(state => state?.user)
  const SocketConnection = useSelector(state => state?.user?.socketConnection)
  useEffect(() => {
    if (CurrentMsg.current) {
      CurrentMsg.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [allMessages])

  useEffect(() => {
    if (SocketConnection) {

      SocketConnection.emit('message-page', params.userId)
    }
    SocketConnection.emit('seen', params.userId)
    SocketConnection.on('message-user', (data) => {

      setdataUser(data)
    })
    SocketConnection.on('message', (data) => {
      setAllMessages(data)
    })

  }, [SocketConnection, params?.userId, user])
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]
    setloading(true)
    const uploadPhoto = await uploadFile(file)
    setloading(false)
    setOpenImageVideo(false)
    setMessages((preve) => {
      return {
        ...preve,
        ImageUrl: uploadPhoto?.url
      }

    })
  }
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0]
    setloading(true)
    setOpenImageVideo(false)
    const uploadPhoto = await uploadFile(file)
    setloading(false)
    setMessages((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto?.url
      }

    })
  }
  const handleOpenImageVideo = () => {
    setOpenImageVideo(!openImageVideo)
  }
  const handleClosePhoto = async (e) => {
    setMessages((preve) => {
      return {
        ...preve,
        ImageUrl: '',
        videoUrl: ''
      }

    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setMessages((preve) => {
      return {
        ...preve,
        [name]: value
      }

    })
  }
  const EmojiClick = (event, emojiObject) => {
    setMessages((preve) =>{
       return {
      ...preve,
      text :(preveinp) =>   preveinp + emojiObject.emoji
    }
  });
    setopenEmoji(!openEmoji);
  };
  const handleSendMessage = (e) => {
    e.preventDefault()
    if (messages.text || messages.ImageUrl || messages.videoUrl) {
      if (SocketConnection) {
        SocketConnection.emit('send message', {
          sender: user?._id,
          receiver: params.userId,
          text: messages.text,
          ImageUrl: messages.ImageUrl,
          videoUrl: messages.videoUrl,
          msgByUserId: user?._id
        })
        setMessages({
          text: "",
          ImageUrl: "",
          videoUrl: ""
        })
      }
    }
  }
  return (
    <>
      <div style={{ backgroundImage: `url(${backgroundimage})` }} className='bg-contain '>


        <header className='sticky flex justify-between border px-4 items-center gap-2  top-0 h-14 bg-white w-full '>
          <div className='flex items-center gap-2'>
            <Link to={'/'} className='lg:hidden'>
              <FaAngleLeft className='pr-3 text-3xl'
              />
            </Link >
            <div className=''>
              <Avatar
                height={50}
                width={50}
                imageUrl={dataUser?.profile_pic}
                name={dataUser?.name}
                _id={dataUser?._id}
              />
            </div>
            <div>
              <h3 className='font-bold text-xl '>{dataUser?.name}</h3>
              <p className=' -mt-1'>{dataUser.online ? <span className='text-primary '>online</span> : <span className='text-red-600'>offline</span>}</p>
            </div>
          </div>
          <div>
            <button className='cursor-pointer hover:text-primary'>
              <BsThreeDotsVertical />
            </button>
          </div>
        </header>
        <section className='h-[calc(100vh-112px)] px-3 relative bg-contain bg-opacity-50 bg-slate-200  overflow-x-hidden overflow-y-scroll scrollbar'>
          {/**Display all messages */}
          <div className='flex items-center justify-center p-14'>
            <p className='text-xs text-slate-500 py-1  px-3 rounded-md bg-orange-200'>Messages are end-to-end encrypted no one out of this chat can read them.</p>
          </div>
          <div ref={CurrentMsg} className='flex flex-col p-2 gap-2'>
            {
              allMessages.map((msg, index) => {
                return (
                  <div className={` flex flex-col rounded-md   w-fit max-w-[280px] lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto bg-teal-200" : "mr-auto bg-white"} `}>

                    {
                      msg?.ImageUrl && (
                        <div>

                          <img
                            src={msg.ImageUrl}
                            className='h-full w-full p-2 object-scale-down'
                          />
                        </div>
                      )
                    }
                    {
                      msg?.videoUrl && (
                        <div>

                          <video
                            className='h-full w-full p-3 object-scale-down'
                            src={msg.videoUrl} controls
                          />
                        </div>
                      )
                    }
                    <div className='flex justify-between'>

                      <p className='px-3 py-1'>{msg.text}</p>
                      <p className='w-fit flex items-end pr-3 text-slate-400 pb-1 text'>{moment(msg.createdAt).format('hh:mm a')}</p>
                    </div>
                  </div>
                )
              })
            }
          </div>
          {/**Display photos to sent */}
          {messages.ImageUrl && (

            <div className='sticky'>

              <div className='flex justify-center  items-center relative p-8 h-full w-2/3 lg:w-1/2 bg-slate-400  bg-opacity-30'>
                <button onClick={handleClosePhoto} className='absolute top-0 right-0 m-2 text-3xl hover:text-red-500'>
                  <IoClose />
                </button>
                <div className='bg-white flex justify-center items-center w-full max-w-sm aspect-square object-scale-down'>
                  <img src={messages.ImageUrl} alt="Upload Pic"
                    className=''
                  />
                </div>
              </div>
            </div>

          )}

          {/**Display Videos to sent */}
          {messages.videoUrl && (
            <div className='sticky'>

              <div className='flex justify-center items-center relative  p-8 h-full w-2/3 lg:w-1/2 bg-slate-400  bg-opacity-30'>
                <button onClick={handleClosePhoto} className='absolute top-0 right-0 m-2 text-3xl hover:text-red-500'>
                  <IoClose />
                </button>
                <div className='bg-white flex justify-center items-center  w-2/3 max-w-sm aspect-square object-scale-down '>
                  <video className='' controls muted src={messages.videoUrl}></video>
                </div>
              </div>
            </div>
          )}
          {
            loading && (
              <div className='h-full flex items-center justify-center'>
                <LoadingSpinner />
              </div>
            )
          }
          <div className={openEmoji ? 'block' : 'hidden'}>
            <Picker
             onEmojiClick={EmojiClick}
            
             />
          </div>
        </section>
        <section className='bg-white h-14 border  gap-3 flex items-center'>
          <div className='flex'>

          <button className='flex items-center hover:bg-slate-200 rounded justify-center p-3 ' >
            <GrEmoji size={22} />
          </button>
          <button onClick={handleOpenImageVideo} className=' hover:bg-slate-200 flex items-center justify-center p-3 rounded'>
            <CgAttachment size={18} />
          </button>
          </div>
          <form className='h-full flex gap-3 w-full' onSubmit={handleSendMessage} >
            <input
              type="text"
              name='text'
              placeholder='Type a message'
              value={messages?.text }
              onChange={handleChange}
              className='outline-none h-full w-full '
            />
            {/**Display image  */}
            {
              openImageVideo && (


                <div className='absolute bottom-14  flex flex-col p-1 justify-center items-center w-36  m-2 bg-white rounded'>
                  <label htmlFor='UploadImage' className='flex items-center p-2  mx-1 w-full rounded  gap-4 hover:bg-slate-100 cursor-pointer'>
                    <button>
                      <FaImages className='text-primary' size={20} />
                    </button>
                    <p className='text-sm'>Images</p>
                  </label>

                  <label htmlFor='UploadVideo' className='flex items-center   p-2 w-full rounded  gap-4 hover:bg-slate-100 cursor-pointer'>
                    <button>
                      <MdOutlineVideoLibrary className='text-purple-700' size={20} />
                    </button>
                    <p className='text-sm'>Videos</p>
                  </label>
                  <input
                    type="file"
                    value={messages?.ImageUrl}
                    id='UploadImage'
                    onChange={handleUploadPhoto}
                    className='hidden'
                  />
                  <input
                    type="file"
                    value={messages?.videoUrl}
                    id='UploadVideo'
                    onChange={handleUploadVideo}
                    className='hidden'
                  />
                </div>
              )
            }
            <button>
              <LuSendHorizonal size={23} className='mr-7 text-primary' />
            </button>
          </form>
        </section>


      </div>
    </>
  )
}

export default Messages
