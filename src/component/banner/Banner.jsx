import React from "react";
import { useNavigate } from "react-router-dom";

export default function Banner() {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-[#f0f0f0] to-[#e7e7e7] flex flex-col md:flex-row items-center justify-between px-6 md:px-20 lg:px-44 py-16 md:py-0 h-auto md:h-[670px] relative overflow-hidden">

      {/* Left Section */}
      <div className="flex-1 flex flex-col justify-center md:pr-10 text-center md:text-left">
        <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mb-4 w-max mx-auto md:mx-0">
          Trending 2025
        </span>

        <h2 className="font-medium text-gray-600 text-lg md:text-xl">
          Premium Ergonomic Collection
        </h2>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-2 leading-tight">
          The Flexible Chair
        </h1>
        <p className="text-base md:text-lg mt-4 text-gray-700 max-w-lg mx-auto md:mx-0">
          Designed for comfort and style, our latest ergonomic chair is perfect
          for long hours of work and relaxation. Enhance your workspace today.
        </p>

        <button
          onClick={() => navigate(`/product`)}
          className="mt-6 px-5 py-3 bg-gradient-to-r from-[#FF7004] to-[#FF9F4A] text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300 w-[140px] md:w-[160px] mx-auto md:mx-0"
        >
          Shop Now
        </button>

      </div>

      {/* Right Section */}
      <div className="flex-1 mt-10 md:mt-0 relative flex justify-center">
        <img
          src="../../images/section1/chair.png"
          alt="Flexible Chair"
          className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-full h-auto max-h-[300px] md:max-h-[400px] object-contain transform hover:scale-105 transition duration-500"
        />
      </div>
    </div>
  );
}
