import React from 'react';
import Cook from '../components/cook.png';
import { Link } from 'react-router-dom';

function HomePromo() {
  return (
    <div className='text-white flex justify-center w-full'>
      <div className='border-teal-100  h-fit w-full md:max-w-3xl md:text-sm flex flex-col'>
        <div className='border-red-400 h-64 w-64 mx-auto'>
          <img src={Cook} alt="" className='w-full h-full object-cover' />
        </div>
        <div className='h-fit rounded-lg'>
          <h1 className='text-5xl md:text-7xl font-bold text-center text-emerald-50'>Cooked Something?</h1>
        </div>
        <div className='text-xs md:text-base text-center text-emerald-50 px-4'>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quaerat nihil sed enim dolor facere, praesentium perspiciatis nobis corporis illo at omnis nemo laborum. Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel, molestias. Lorem ipsum dolor sit amet consectetur, adipisicing elit. In optio, alias quis nesciunt suscipit non unde nisi tempora libero! Iusto.
        </div>
        <div className='border-gray-300 flex'>
          <div className='mx-auto w-1/3 md:w-1/5 h-10 rounded-3xl text-center bg-emerald-700 transition hover:bg-emerald-950 flex text-white items-center justify-center '>
            <Link to="/" className='my-1'>Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePromo;
