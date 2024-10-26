import React from 'react'

function PromoCard(props) {
  return (
    <div className=' h-60 rounded-lg w-1/3 bg-emerald-50 bg-opacity-70 shadow-xl min-w-64 flex-col align-middle p-4 transition-all hover:bg-zinc-900 hover:text-white'>
        <div className=' h-1/3 w-2/6 mx-auto rounded-full overflow-hidden flex bg-[url(https://img.freepik.com/free-vector/guitar_98292-4397.jpg?w=900&t=st=1727948657~exp=1727949257~hmac=55c481f3eadd0b559621d8eaee0000a95f30a00fad4a59dc67c7a14d13949c4b)] bg-cover'>
        </div>
        <div className='text-xl text-center   mt-3 font-medium transition-all group-hover:text-white'>
            {props.title}
        </div>
        <hr className='border border-stone-200 rounded-lg mt-2 w-4/5 mx-auto' />
        <div className=' max-w-56 flex-initial text-stone-900 text-center text-xs pt-3 transition-all hover:text-zinc-300 group-hover:text-white '>
          Professionaly Produced Beats Fit for your projects,get a sneak peak right now , let the mosphit happen .
            
        </div>
        <div className='text-sm text-center pt-1 group-hover:text-white'>Learn More</div>
    </div>
  )
}

export default PromoCard