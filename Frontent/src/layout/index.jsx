import React from 'react'
import logo from '../assets/logo.png'
const Authlayouts = ({children}) => {
  return (
    <>
    <header className='bg-white flex items-center justify-center shadow-md py-2 h-20'>
      <img  src={logo} alt="logo" height={60} width={180} />
    </header>
      {children}
    </>
  )
}

export default Authlayouts
