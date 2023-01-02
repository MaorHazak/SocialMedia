import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { GrTrash } from "react-icons/gr";

import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';

import { client, urlFor } from '../client';
// import { fetchUser } from '../utils/fetchUser';

// const Pin = ({pin:{postedBy, image, _id, destination, save}}) => {
//   const [postHovered, setPostHovered] = useState(false);
//   const [savingPost, setSavingPost] = useState(false);
//   const user = fetchUser();
//   // const user = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();
//   const navigate = useNavigate();
// // !! return bol
//   alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];
  
  
  const Pin = ({ pin: { postedBy, image, _id, destination, save } }) => {
    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);
    
    const navigate = useNavigate();
    
    // const { postedBy, image, _id, destination, save } = pin;
    const user_data = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;
    // console.log(user)
    // const alreadySaved = (save?.filter((item) => item?.postedBy?._id === user.googleId)?.length)
    let alreadySaved = (save?.filter((item) => item?.postedBy?._id === user_data?.googleId))?.length;
    alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

  const savePin = (id) => {
    if (alreadySaved?.length === 0) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [{
          _key: uuidv4(),
          userId: user_data?.googleId,
          postedBy: {
            _type: 'postedBy',
            _ref: user_data?.googleId,
          },
        }])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id) => {
    client
      .delete(id)
      .then(() => {
        window.location.reload();
      });
  };

  return ( 
    <div className='m-2'>
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className='relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out'
      >
      <img className="rounded-lg w-full " src={(urlFor(image).width(250).url())} alt="user-post" />
      
      {postHovered && (
        <div
        className='absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50'
        style={{height:'100%'}}
        >
          <div className='flex items-center justify-between'>
            <div className='flex gap-2'>
              <a
                href={`${image?.asset?.url}?dl=`}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-9 h-9 p-2 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
              >
                <MdDownloadForOffline/>
              </a>
            </div>
            {alreadySaved? (
              <button type='button' className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
              {save?.length}  Saved
              </button>
            ):(
              <button
              onClick={(e) => {
                e.stopPropagation()
                savePin(_id)
              }}
              type='button' className="bg-red-500 opacity-70 hover:opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outline-none">
                Save
              </button>
            )}
          </div>
          <div className="flex justify-between items-center gap-2 w-full">
              {destination && (
                <a
                  href={destination}
                  target="_blank"
                  className="bg-white flex items-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-md"
                  rel="noreferrer"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination?.length > 20 ? destination?.slice(12,20) : destination?.slice(9) }
                </a>
              )}
              {`postedBy?._id === user_data?.googleId` && (
           <button
            className="bg-white p-2 rounded-full w-8 h-8 flex items-center justify-center text-dark opacity-75 hover:opacity-100 outline-none"
             type="button"
             onClick={(e) => {
               e.stopPropagation();
               deletePin(_id);
              }}
           >
             <AiTwotoneDelete />
           </button>
           )}
            </div>
        </div>
      )}
      </div>
      <Link to={`/user-profile/${postedBy?._id}`} className='flex gap-2 mt-2 items-center'>
      <img
      className="w-8 h-8 rounded-full object-cover"
      src={postedBy?.image}
      alt="user-profile"
    />
    <p className="font-semibold capitalize">{postedBy?.userName}</p>
      </Link>
    </div>
  )
  }
export default Pin
