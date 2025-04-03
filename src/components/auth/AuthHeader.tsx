
import React from 'react';

const AuthHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="inline-block w-12 h-12 rounded-full bg-kids-blue flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V19C17 19.5523 16.5523 20 16 20H8C7.44772 20 7 19.5523 7 19V5Z" fill="white"/>
          <path d="M5 8C5 7.44772 5.44772 7 6 7C6.55228 7 7 7.44772 7 8V16C7 16.5523 6.55228 17 6 17C5.44772 17 5 16.5523 5 16V8Z" fill="white"/>
          <path d="M17 8C17 7.44772 17.4477 7 18 7C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17C17.4477 17 17 16.5523 17 16V8Z" fill="white"/>
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-800">ActivityHub</h1>
      <p className="text-gray-600 mt-2">Sign in to your account or create a new one</p>
    </div>
  );
};

export default AuthHeader;
