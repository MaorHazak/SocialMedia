import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
//import { GoogleLogin } from 'react-google-login';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logo from '../assets/logowhite.png';
import { GoogleOAuthProvider } from '@react-oauth/google';
import jwt_decode from 'jwt-decode';

// import { gapi } from "gapi-script";
// import {useEffect} from 'react'

import { client } from '../client';

const Login = () => {
  const navigate = useNavigate();
  const responseGoogle = (response) => {
    console.log(response)
    localStorage.setItem('user', JSON.stringify(response.credential));
    const { name, jti, picture } = jwt_decode(response.credential);
    const doc = {
      _id: jti,
      _type: 'user',
      userName: name,
      image: picture,
    };
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <div className='flex justify-start items-center flex-col h-screen'>
      <div className='relative w-full h-full'>
        <video
          src={shareVideo}
          type='video/mp4'
          loop
          controls={false}
          muted
          autoPlay
          className='w-full h-full object-cover'
        />

        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt='logo' />
          </div>

          <div className="shadow-2xl">
          <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
          <GoogleLogin
          // i can console.log(process.env.name)- and see the api token.
          // clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
          render={(renderProps) => (
            <button
            type="button"
            className="bg-mainColor flex justify-center items-center p-4 rounded-lg cursor-pointer outline-none"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            >
            <FcGoogle className="mr-4" /> Sign in with google
            </button>
            )}
            onSuccess={responseGoogle}
            onClick={responseGoogle}
            onFailure={responseGoogle}
            cookiePolicy="single_host_origin"
            />
            </GoogleOAuthProvider>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login
