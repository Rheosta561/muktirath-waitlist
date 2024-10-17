import React, { useState } from 'react';
import logo from './assets/logo.png';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <nav className="text-slate-200 w-full h-12 p-1 bg-blend-normal bg-zinc-950 fixed bg-opacity-90 flex justify-between items-center px-4 md:px-8 transition-all">
        {/* Logo for larger screens */}
        <img src={logo} alt="Logo" className="h-8 md:h-10 lg:h-12 hidden md:block" />
        
        {/* Menu Icon*/}
        <button
          className="block md:hidden focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <ul className="hidden md:flex md:items-center mx-auto gap-8">
          <li className="font-extralight text-sm">
            <Link to="/">Home</Link>
          </li>
          <li className="font-extralight text-sm">
            <Link to="/about">About</Link>
          </li>
          <li className="font-extralight text-sm">
            <Link to="/contact">Contact</Link>
          </li>
          <li className="font-extralight text-sm">
            <Link to="/pricing">Pricing</Link>
          </li>
          <li className="font-extralight text-sm">
            <Link to="/payment">Payment</Link>
          </li>
        </ul>
        <ul className="hidden md:flex items-center gap-2">
          <li className="border h-8 px-4 rounded-lg flex items-center font-extralight">
            <Link to="/login">Login</Link>
          </li>
          <li>/</li>
          <li className="border h-8 px-4 rounded-lg flex items-center font-extralight">
            <Link to="/register">Register</Link>
          </li>
        </ul>

        <div
          className={`md:hidden absolute top-12 left-0 w-full bg-zinc-950 bg-opacity-90 z-10 transition-all duration-300 ease-in-out transform ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          } overflow-hidden`}
        >
          <ul className="flex flex-col items-center gap-4 py-4">
            <li className="font-extralight text-sm">
              <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            </li>
            <li className="font-extralight text-sm">
              <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            </li>
            <li className="font-extralight text-sm">
              <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
            </li>
            <li className="font-extralight text-sm">
              <Link to="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
            </li>
            <li className="font-extralight text-sm">
              <Link to="/payment" onClick={() => setIsOpen(false)}>Payment</Link>
            </li>
            <li className="border h-8 px-4 rounded-lg flex items-center font-extralight">
              <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
            </li>
            <li className="border h-8 px-4 rounded-lg flex items-center font-extralight">
              <Link to="/register" onClick={() => setIsOpen(false)}>Register</Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
