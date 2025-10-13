import React from 'react';
import heroImage from '../../assets/hero.png';

const Hero = () => {
  return (
    <div className="h-screen flex">
      
      {/* Left Side - Content */}
      <div className="w-1/2 bg-gray-50 flex items-center justify-center">
        <div className="space-y-8 px-16">
          {/* Title */}
          <div>
            <h1 className="text-6xl font-bold text-gray-900">
              Simple Task Tracker
            </h1>
          </div>
          
          {/* Login & Signup Section */}
          <div className="space-y-4">
            <button onClick={() => window.location.href = '/login'} className="w-64 bg-black text-white py-4 px-8 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors">
              Login
            </button>

            <p className="text-gray-600 text-base">
              Don't have an account? <span onClick={() => window.location.href = '/register'} className="text-black font-semibold cursor-pointer hover:underline">Sign up</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Right Side - Image */}
      <div className="w-1/2 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
      </div>
      
    </div>
  );
};

export default Hero;