import React from 'react'
import { BrowserRouter, Routes , Route } from 'react-router-dom'
import LandingPage from './Screens/LandingPage'
import { ThemeProvider } from './components/theme-provider'
import Navbar from './components/Navbar'
import Footer from './components/Footer'


function App() {
  return (
    <ThemeProvider>

   <BrowserRouter>
   <Navbar/>
 
   <Routes>
    <Route path='/home' element={<LandingPage/>}/>
   </Routes>
   <Footer/>
   </BrowserRouter>
   </ThemeProvider>
  )
}

export default App