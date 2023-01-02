import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Navbar, Feed, PinDetail, CreatePin, Search, } from '../components';

const Pins = () => {
  const{searchTerm, setSearchTerm} = useState('')
  const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;

  return (
    <div className='px-2 md:px-5'>
      <div className='bg-gray-50'>
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} user_data={user_data}/>
      </div>
      <div className='h-full'>
       <Routes>
          <Route path="/" element={<Feed/>}/>
          <Route path="/category/:categoryId" element={<Feed/>}/>
          <Route path="/pin-detail/:pinId" element={<PinDetail user_data={user_data && user_data}/>}/>
          <Route path="/create-pin" element={<CreatePin user_data={user_data && user_data}/>}/>
          <Route path="/search" element={<Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>}/>
        </Routes>  
      </div>
    </div>
  )
}

export default Pins
