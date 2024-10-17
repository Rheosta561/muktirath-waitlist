import React from "react";
import Logo from "./logo.png";

function Login() {
  return (
    <div className="min-h-fit flex flex-col lg:flex-row">
      {/* Left section (Form) */}
      <div className="flex-1 flex justify-center items-center bg-zinc-950 text-gray-900 lg:min-h-screen">
        <div className="w-full max-w-md lg:max-w-lg m-4 sm:m-10 bg-zinc-200 shadow sm:rounded-lg p-6 sm:p-12">
          {/* Logo */}
          <div>
            <img
              src={Logo}
              className="w-24 sm:w-32 mx-auto grayscale invert"
              alt="Logo"
            />
          </div>

          {/* Form Section */}
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Sign up</h1>

            <div className="w-full mt-8">
              {/* Google Sign Up */}
              <button className="w-full max-w-xs font-bold shadow-sm rounded-lg mx-auto py-3 bg-zinc-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline">
                <div className="bg-white p-2 rounded-full">
                  <svg className="w-4" viewBox="0 0 533.5 544.3">
                  <path
      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
      fill="#4285f4"
    />
    <path
      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
      fill="#34a853"
    />
    <path
      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
      fill="#fbbc04"
    />
    <path
      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
      fill="#ea4335"
    />
                  </svg>
                </div>
                <span className="ml-4">Sign Up with Google</span>
              </button>

              {/* GitHub Sign Up */}
              <button className="w-full max-w-xs font-bold shadow-sm rounded-lg py-3 mx-auto bg-zinc-100 text-gray-800 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline mt-5">
                <div className="bg-white p-1 rounded-full">
                  <svg className="w-6" viewBox="0 0 32 32">
                  <path
      fill="#1877F2"
      d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 17.953 4.388 22.902 10.125 24v-8.437H7.078V12.07h3.047V9.412c0-3.007 1.793-4.687 4.533-4.687 1.313 0 2.686.235 2.686.235v2.953h-1.514c-1.492 0-1.953.926-1.953 1.872v2.286h3.328l-.532 3.493h-2.796V24C19.612 22.902 24 17.952 24 12.073z"
    />
    <path
      fill="#fff"
      d="M16.671 15.563l.532-3.493h-3.328V9.785c0-.946.461-1.872 1.953-1.872h1.514V4.96s-1.373-.235-2.686-.235c-2.74 0-4.533 1.68-4.533 4.687v2.658H7.078v3.492h3.047V24h3.75v-8.437h2.796z"/>
                  </svg>
                </div>
                <span className="ml-4">Sign Up with GitHub</span>
              </button>
            </div>

            {/* Divider */}
            <div className="mt-10 border-b text-center w-full">
              <span className=" px-2 text-sm text-gray-600">
                Already a User ? <p className="text-emerald-800">Sign In</p> 
              </span>
            </div>
            <div className="mt-10 mb-4 border-b text-center w-full">
              <span className=" px-2 text-sm text-gray-600">
                Or sign up with email
              </span>
            </div>

            {/* Email and Password Fields */}
            <div className="w-full max-w-xs">
              <input
                className="w-full px-8 py-4 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="email"
                placeholder="Email"
              />
              <input
                className="w-full px-8 py-4 mt-5 rounded-lg bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                type="password"
                placeholder="Password"
              />
              <button className="mt-5 w-full py-4 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-900 transition-all duration-300 ease-in-out flex items-center justify-center">
                <svg
                  className="w-6 h-6 -ml-2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Sign Up Icon */}
                </svg>
                <span className="ml-3 ">Sign Up</span>
              </button>

              <p className="mt-6 text-xs text-gray-600 text-center">
                I agree to abide by ExPee Music
                <a href="#" className="border-b border-gray-500"> Terms of Service </a> and its
                <a href="#" className="border-b border-gray-500"> Privacy Policy </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right section (Illustration) */}
      <div className="hidden lg:flex flex-1 items-center bg-indigo-100">
        <div
          className="m-8 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15846363383124096567-undraw_designer_life_w96d.svg')",
          }}
        ></div>
      </div>
    </div>
  );
}

export default Login;
