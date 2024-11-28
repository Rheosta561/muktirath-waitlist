import React from 'react'
import Avatar from './components/Avatar'
import Submit from './components/Submit'

function Intro() {
  return (
    <div className='flex flex-col  items-center  h-screen w-screen p-4'>
        <div className='text-7xl text-center font-semibold mt-16'>Hi There</div>
        <div className='text-sm text-gray-800 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. lorem</div>
        <div className='text-xs text-gray-600 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. lorem</div>
        <div className='text-xs text-gray-600 text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. lorem</div>
        <br />
        <hr className='border border-zinc-900 w-1/2 rounded-lg'/>
        <br />
        <Avatar source="./inf1.png" title="Rejuvanating Influencers"/>
        <Avatar source ='./inf2.png' title='Voice Your Talent'/>
        <Avatar source='./inf3.jpg' title='Build your portfolio'/>
        <br />
        <div className='text-8xl text-center font-semibold w-'>
            Presenting <span className='text-emerald-900'>You</span> All New 

        </div>
        <br />
        <div className='text-center text-sm text-gray-700 md:w-3/4'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Maiores voluptatem iste cum quam. Dolor odio aliquid odit possimus doloremque eligendi hic aliquam at, velit amet qui delectus, nam provident porro deleniti quae beatae earum doloribus incidunt? Ratione quisquam eligendi ea!</div>
        <br />
        <hr className='border border-zinc-500 w-1/2 rounded-lg' />
        <img src="./logo.png" alt="" className='bg-cover scale-75 -mt-28' />
        <div className='-mt-40 text-center text-xs text-zinc-700 w-3/4 md:w-1/2'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem sequi saepe sapiente ut mollitia natus asperiores,Lorem ipsum dolor sit amet, consectetur adipisicing elit. Soluta, impedit. </div>
        <div className='mt-4'>

        <Submit/>


        </div>
    </div>
  )
}

export default Intro