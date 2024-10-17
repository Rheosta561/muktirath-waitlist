import React from 'react'

function CommentCard() {
  return (
    <div className=' w-60 h-40 md:w-72,h-52 rounded-lg  p-4 flex flex-col'>
        <p className='text-white text-xl font-semibold w-3/4 mx-auto  h-fit text-center'>"Best In Quality"</p>
        <p className='text-xs text-center text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam, asperiores.</p>
        <div className=' h-fit p-2 flex mx-auto'>
            <div className='h-8 w-8 rounded-full bg-zinc-50'></div>
            <div className=' w-32 ml-px flex flex-col'>
                <p className='text-gray-400 text-xs mt-1 ml-2'>@Username</p>
                <p className='text-gray-300 text-sm ml-2 -mt-0.5'>Alex</p>
            </div>
        </div>
    </div>
  )
}

export default CommentCard