import React from 'react'

function Avatar(props) {
  return (
    <div className='w-3/4 p-4 flex flex-col items-center'>
        <div className='h-72 w-96 bg-zinc-100 rounded-lg '>
            <img src={props.source} className='h-full w-full' alt="" />
        </div>
        <div className='text-5xl text-center'>{props.title}</div>
        <div className='text-sm text-gray-700 text-center md:w-1/2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi, delectus!</div>
        <div className='text-xs text-gray-500 text-center md:w-1/2'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quam facere? Tempora dolorem earum aspernatur quibusdam temporibus neque nemo laborum?</div>
    </div>
  )
}

export default Avatar