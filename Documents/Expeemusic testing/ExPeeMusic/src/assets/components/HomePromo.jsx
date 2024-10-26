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
        "Cooked something powerful in the studio? Just like the Vikings who conquered lands, it's time to let your beats or tracks conquer the airwaves! Upload your creations to our beatstore, and watch your sound echo far and wide. Earn your gold as your music reaches new realms. Whether it's a thunderous bass drop or a melody smooth as a Viking sail, this is your chance to rule the charts. So sharpen your sound, take the leap, and let the world feel the power of what you've cooked. Skål to your journey and success—your sound, your conquest!"







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
