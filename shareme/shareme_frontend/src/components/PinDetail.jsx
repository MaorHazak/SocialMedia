


import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = (postedBy) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  const userInfo = localStorage.getItem('user_data') !== 'undefined' ? JSON.parse(localStorage.getItem('user_data')) : null;

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    if (query) {
      client.fetch(`${query}`).then((data) => {
        setPinDetail(data[0]);
        if (data[0]) {
          const query1 = pinDetailMorePinQuery(data[0]);
          client.fetch(query1).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  const addComment = () => {
    if(comment){
      setAddingComment(true);
      // console.log(postedBy)
      client
        .patch(pinId)
        .setIfMissing({comment: []})
        .insert('after', 'comment[-1]', [{
          comment,
          _key:uuidv4(),
          postedBy:{
            _type: 'postedBy',
            _ref: userInfo._id
          }
        }])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false)
        })
    }
  }

  if(!pinDetail){
    return (
      <Spinner message='Loading pin...' />
    );
  }

  return(
    <>
    <div className="flex xl:flex-col flex-col m-auto bg-white" style={{ maxWidth: '1500px', borderRadius: '32px' }}>
      <div className="flex justify-center items-center md:items-start flex-initial">
        <img
          className="rounded-t-3xl rounded-b-lg "
          src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
          alt="user-post"
        />
      </div>
      <div className="w-full p-5 pt-5 mt-5 rounded-lg flex-1 xl:min-w-620 border-dashed border-2 border-gray-400">
        <div className="flex items-center justify-between ">
          <div className="flex gap-2 items-center">
            <a
              href={`${pinDetail.image?.asset?.url}?dl=`}
              download
              className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
            >
              <MdDownloadForOffline/>
            </a>
          </div>
          <a href={pinDetail.destination} target="_blank" rel="noreferrer">
            {pinDetail.destination}
          </a>
        </div>
        <div>
          <h1 className='text-4xl font-bold break-words mt-3'>
            {pinDetail.title}
          </h1>
          <p className='mt-3'>{pinDetail.about}</p>
        </div>
        <Link to={`/user-profile/${pinDetail?.postedBy?._id}`} className='flex gap-2 mt-5 items-center bg-white rounded-lg'>
          <img
          className="w-8 h-8 rounded-full object-cover"
          src={pinDetail?.postedBy?.image}
          alt="user-profile"
            />
          <p className="font-semibold capitalize"> {pinDetail?.postedBy?.userName} </p>
        </Link>
        <h2 className='mt-5 text-2xl'>Comments</h2>
        <div className='max-h-370 overflow-y-auto'>
        {pinDetail?.comments?.map((item) => (
          <div className="flex gap-2 mt-5 items-center bg-white rounded-lg" key={item.comment}>
            <img
              src={item.postedBy?.image}
              className="w-10 h-10 rounded-full cursor-pointer"
              alt="user-profile"
            />
            <div className="flex flex-col">
              <p className="font-bold">{item.postedBy?.userName}</p>
              <p>{item.comment}</p>
            </div>
          </div>
        ))}
        </div>
        <div className='flex flex-wrap- mt-6 gap-3'>
          <Link to={`/user-profile/${userInfo?._id}`}>
            <img
              className="w-10 h-10 rounded-full cursor-pointer"
              src={userInfo?.image}
              alt="user-profile"
            />
          </Link>
          <input
            className='flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300'
            type='text'
            placeholder='Add a new comment...'
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            type='button'
            className='bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none'
            onClick={addComment}
          >
          {addingComment ? 'Posting the comment...' : 'Post'}
          </button>
        </div>
      </div>
    </div>

    {pins?.length > 0 ? (
        <>
        <h2 className='text-center font-bold text-2xl mt-8 mb-4'>
          More like this...
        </h2>
        <MasonryLayout pins={pins}/>
        </>
      ) : (
        <div className='mt-4'>
        <Spinner message="Loading more pins..." />
        </div>
        )}
        </>
  )}

  export default PinDetail;
