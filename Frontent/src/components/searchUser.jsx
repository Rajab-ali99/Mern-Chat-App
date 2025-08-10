import React from 'react'
import { useState, useEffect } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import LoadingSpinner from './loadingSpinner';
import SearchUserCard from './SearchUserCard';
import { IoClose } from "react-icons/io5";
import toast from 'react-hot-toast';
import axios from 'axios';
const SearchUser = ({ onClose }) => {
    const [searchUser, setSearchUser] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState("")
    const handleSearchUser = async () => {
        const url = `${import.meta.env.VITE_BACKEND_URL}/api/search-user`
        try {
            setLoading(true)
            const response = await axios.post(url, {
                search: search
            }
            )
            setLoading(false)
            setSearchUser(response.data.data)
        } catch (error) {
            toast.error(error?.response?.data?.message)
        }
    }


    return (
        <div className='fixed top-0 left-0 right-0 bottom-0 bg-slate-600 bg-opacity-55 '>
            <div className='w-full  max-w-lg px-4 lg:px-0  mx-auto'>
                {/**input search user */}
                <div className='bg-white flex items-center rounded justify-between h-14 w-full px-2 mt-16 lg:mt-7'>
                    <input
                        className='w-full  outline-none p-3  '
                        type="text"
                        onChange={(e) => { setSearch(e.target.value) }}
                        value={search}
                        placeholder='Search user by name,email....'
                    />
                    <IoSearchOutline onClick={handleSearchUser} className='bg-white h-14 cursor-pointer text-3xl' />
                </div>
                <div className='bg-white h-[calc(100dvh-150px)] overflow-y-scroll w-full p-4 rounded mt-2'>
                    {/**no user found */}
                    {
                        searchUser.length === 0 && !loading && (
                            <p className='text-center text-slate-400'>No user found!</p>
                        )
                    }
                    {
                        loading && (
                            <div>

                                <LoadingSpinner />
                            </div>
                    
                            
                        )
                    }
                    {
                        searchUser.length !== 0 && !loading && (
                            searchUser.map((user, index) => {
                                return (
                                    <SearchUserCard key={user._id} user={user} onClose={onClose} />
                                )
                            })
                        )
                    }
                </div>
            </div>
            <div className='absolute top-0 right-0 p-4 '>
                <button><IoClose className='text-2xl lg:text-4xl hover:text-white' onClick={onClose}/></button>
            </div>
        </div>
    )
}

export default SearchUser
