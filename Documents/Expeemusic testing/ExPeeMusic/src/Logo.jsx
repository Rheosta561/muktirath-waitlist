import React from 'react'
import logo from './assets/logo.png'

function Logo({props}) {
  return (
    <div className='mt-16'>
        <img src={logo} alt="" className=' h-20 m-auto ' />
    </div>
  )
}

export default Logo