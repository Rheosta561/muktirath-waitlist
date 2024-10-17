import React from 'react';
import Logo from '../components/logo.png';

function Footer() {
  return (
    <div>
      <nav className='bg-zinc-950 h-fit w-full p-4'>
        <div className='flex flex-col md:flex-row justify-between mb-4'>
          <div className='h-fit w-full md:w-1/3 text-center md:text-left'>
            <img src={Logo} alt="" className='w-24 mx-auto md:mx-0' />
            <div className='text-zinc-200 text-xs'>Copyright {'\u00A9'} ExPee Productions</div>
            <div className='text-zinc-200 text-xs'>All Rights Reserved | 2024</div>
          </div>
          <div className='h-fit w-full md:w-1/3 text-center md:text-right'>
            <div className='text-zinc-200 text-sm'>Phone: +917303036689</div>
            <div className='text-zinc-200 text-sm'>Help: support@expeemusic.co.org</div>
          </div>
        </div>

        <div className='flex flex-col md:flex-row justify-around'>
          {[...Array(3)].map((_, index) => (
            <div key={index} className='h-fit w-full md:w-1/4 text-center mb-4 md:mb-0'>
              <h5 className='text-white pt-4 text-lg'>Privacy and Policies</h5>
              <div className='px-2'>
                <p className='text-zinc-400 text-sm'>Refund and Support</p>
              </div>
              <div className='px-2'>
                <p className='text-zinc-400 text-sm'>Rights and Allowance</p>
              </div>
              <div className='px-2'>
                <p className='text-zinc-400 text-sm'>Royalties Usage</p>
              </div>
              <div className='px-2'>
                <p className='text-zinc-400 text-sm'>Copyright Violation</p>
              </div>
              <div className='px-2'>
                <p className='text-zinc-400 text-sm'>Allowance for Inputs</p>
              </div>
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default Footer;
