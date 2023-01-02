import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch, IoIosPersonAdd } from 'react-icons/io';
  
// import { HiPlusCircle } from "react-icons/hi2";
// import { fetchUser } from '../utils/fetchUser';

// const user = fetchUser();
const Navbar = ({user , searchTerm, setSearchTerm}) => {
  const navigate = useNavigate();
  
  // console.log(user)
  const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;
// const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
  // console.log(user_data)
  return(
    <>
    <div className='flex gap-2 md:gap-5 w-full mt-5 pb-4'>
    
      <div className='flex justify-start items-center w-full px-2 rounded-md bg-white border-none outline-none focus-within:shadow-sm'>
      
        <IoMdSearch fontSize={21} className='ml-1'/>
        <input
        type='text'
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search'
        value={searchTerm}
        onFocus={() => navigate('/search')}
        className='p-2 w-full bg-white outline-none'
        // <p className="font-semibold capitalize">{userInfo?.userName}</p>
        />
        
      </div>
      <div className='flex gap-2 items-center'>
      <Link to={`user-profile/${user_data?._id}`} className='hidden md:block'>

      {!user_data ? (
        <>
          <Link to={`/login`} >
           <IoIosPersonAdd className='w-8 h-8'/>
          </Link>
        </>
      ) : (
        <>
        <img src={user_data?.image} alt='user-pic' className='rounded-full w-12 mr-3' />
        <p className="font-semibold capitalize mr-2">{user_data?.userName}</p>
        </>
      )}

     
        
        </Link>
        {user_data ? (
          <Link to="/create-pin" className="bg-black text-white rounded-lg w-6 h-6 md:w-10 md:h-8 flex justify-center items-center">
            <IoMdAdd/>
          </Link>
        ): (
          null
        )}
      </div>
    </div>
    </>
  );
}
export default Navbar;
