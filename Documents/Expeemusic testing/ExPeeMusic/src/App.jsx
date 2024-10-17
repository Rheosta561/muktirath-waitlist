import React from "react";
import Navbar from "./Navbar";
import Logo from "./Logo";
import Login from "./assets/components/Login";
import PromoGrid from "./assets/components/PromoGrid";
import Footer from "./assets/components/Footer";
import HomePromo from "./assets/components/homepromo";
import CommentGrid from "./assets/components/CommentGrid";

import { createBrowserRouter, RouterProvider } from "react-router-dom";


const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <div>
        <Login/>
      </div>
    ),
  },
  {
    path: "/",
    element: (
      <div className="hide-scrollbar overflow-hidden relative">
        <Navbar />
        
        <Logo />
        <br />
        <PromoGrid />
        <HomePromo />
        <br />
        <HomePromo />
        <br />
        <HomePromo />
        <br />
        <br />
        <CommentGrid/>
        <br />
        <Footer />

      </div>
    ),
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
